const STORAGE_PREFIX = "aipri_card_state_";
const EXPORT_VERSION = 1;
const APP_SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./cards-data.js",
  "./cards.json",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

const state = {
  cards: [],
  userState: new Map(),
  filteredCards: [],
  selectedCardId: null,
  selectedImageSide: "front",
  currentView: "all",
  filters: {
    search: "",
    generation: "",
    character: "",
    owned: "",
    wantedOnly: false,
    favoriteOnly: false,
  },
  deferredInstallPrompt: null,
  noteSaveTimer: null,
};

const elements = {
  totalCount: document.getElementById("totalCount"),
  ownedCount: document.getElementById("ownedCount"),
  wantedCount: document.getElementById("wantedCount"),
  favoriteCount: document.getElementById("favoriteCount"),
  searchInput: document.getElementById("searchInput"),
  generationFilter: document.getElementById("generationFilter"),
  characterFilter: document.getElementById("characterFilter"),
  ownedFilter: document.getElementById("ownedFilter"),
  wantedOnlyFilter: document.getElementById("wantedOnlyFilter"),
  favoriteOnlyFilter: document.getElementById("favoriteOnlyFilter"),
  resetFiltersButton: document.getElementById("resetFiltersButton"),
  exportButton: document.getElementById("exportButton"),
  importButton: document.getElementById("importButton"),
  importFileInput: document.getElementById("importFileInput"),
  installButton: document.getElementById("installButton"),
  resultSummary: document.getElementById("resultSummary"),
  syncStatus: document.getElementById("syncStatus"),
  segmentedButtons: Array.from(document.querySelectorAll(".segmented__button")),
  cardGrid: document.getElementById("cardGrid"),
  emptyState: document.getElementById("emptyState"),
  cardTemplate: document.getElementById("cardTemplate"),
  cardDialog: document.getElementById("cardDialog"),
  closeDialogButton: document.getElementById("closeDialogButton"),
  dialogImage: document.getElementById("dialogImage"),
  dialogCode: document.getElementById("dialogCode"),
  dialogName: document.getElementById("dialogName"),
  dialogMeta: document.getElementById("dialogMeta"),
  dialogCharacter: document.getElementById("dialogCharacter"),
  dialogGeneration: document.getElementById("dialogGeneration"),
  dialogCategory: document.getElementById("dialogCategory"),
  showFrontButton: document.getElementById("showFrontButton"),
  showBackButton: document.getElementById("showBackButton"),
  ownedCheckbox: document.getElementById("ownedCheckbox"),
  wantedCheckbox: document.getElementById("wantedCheckbox"),
  favoriteButton: document.getElementById("favoriteButton"),
  noteTextarea: document.getElementById("noteTextarea"),
};

boot();

async function boot() {
  wireEvents();
  await registerServiceWorker();
  await prewarmShellCache();
  await loadCards();
  populateFilterOptions();
  render();
}

function wireEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value.trim().toLowerCase();
    render();
  });

  elements.generationFilter.addEventListener("change", (event) => {
    state.filters.generation = event.target.value;
    render();
  });

  elements.characterFilter.addEventListener("change", (event) => {
    state.filters.character = event.target.value;
    render();
  });

  elements.ownedFilter.addEventListener("change", (event) => {
    state.filters.owned = event.target.value;
    render();
  });

  elements.wantedOnlyFilter.addEventListener("change", (event) => {
    state.filters.wantedOnly = event.target.checked;
    render();
  });

  elements.favoriteOnlyFilter.addEventListener("change", (event) => {
    state.filters.favoriteOnly = event.target.checked;
    render();
  });

  elements.resetFiltersButton.addEventListener("click", resetFilters);

  elements.segmentedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.currentView = button.dataset.view;
      updateSegmentedButtons();
      render();
    });
  });

  elements.exportButton.addEventListener("click", exportState);
  elements.importButton.addEventListener("click", () => elements.importFileInput.click());
  elements.importFileInput.addEventListener("change", importStateFromFile);

  elements.installButton.addEventListener("click", promptInstall);
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  elements.showFrontButton.addEventListener("click", () => switchDialogImage("front"));
  elements.showBackButton.addEventListener("click", () => switchDialogImage("back"));

  elements.ownedCheckbox.addEventListener("change", (event) => {
    updateSelectedCardState({ owned: event.target.checked });
  });

  elements.wantedCheckbox.addEventListener("change", (event) => {
    updateSelectedCardState({ wanted: event.target.checked });
  });

  elements.favoriteButton.addEventListener("click", () => {
    const selectedState = getSelectedCardState();
    updateSelectedCardState({ favorite: !selectedState.favorite });
  });

  elements.noteTextarea.addEventListener("input", (event) => {
    const note = event.target.value;
    clearTimeout(state.noteSaveTimer);
    state.noteSaveTimer = setTimeout(() => {
      updateSelectedCardState({ note }, { silent: true });
      showSyncStatus("備註已自動儲存");
    }, 220);
  });

  elements.cardDialog.addEventListener("close", () => {
    state.selectedCardId = null;
    state.selectedImageSide = "front";
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.cardDialog.open) {
      elements.cardDialog.close();
    }
  });
}

async function loadCards() {
  try {
    const rawCards = await loadCardsData();
    state.cards = rawCards
      .map(normalizeCard)
      .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    hydrateAllUserState();
  } catch (error) {
    console.error(error);
    elements.resultSummary.textContent =
      "卡片資料載入失敗。若你是直接開 file://，請改用本機靜態伺服器；否則請確認 cards.json 與 cards-data.js 存在。";
    showSyncStatus("資料載入失敗");
  }
}

async function loadCardsData() {
  if (Array.isArray(window.__AIPRI_CARDS__) && window.__AIPRI_CARDS__.length > 0) {
    return window.__AIPRI_CARDS__;
  }

  const response = await fetch("cards.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`資料載入失敗：${response.status}`);
  }

  return response.json();
}

function normalizeCard(card) {
  return {
    id: String(card.id),
    name: card.name || "未命名卡片",
    character: card.character || "未分類角色",
    generation: card.generation || "未分類代數",
    category: card.category || "一般卡",
    frontImage: card.frontImage,
    backImage: card.backImage || card.frontImage,
  };
}

function hydrateAllUserState() {
  state.userState.clear();
  state.cards.forEach((card) => {
    state.userState.set(card.id, readStoredState(card.id));
  });
}

function readStoredState(cardId) {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${cardId}`);
  if (!raw) {
    return defaultCardState();
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      owned: Boolean(parsed.owned),
      wanted: Boolean(parsed.wanted),
      favorite: Boolean(parsed.favorite),
      note: typeof parsed.note === "string" ? parsed.note : "",
    };
  } catch (error) {
    console.warn(`讀取卡片 ${cardId} 狀態失敗`, error);
    return defaultCardState();
  }
}

function defaultCardState() {
  return {
    owned: false,
    wanted: false,
    favorite: false,
    note: "",
  };
}

function saveCardState(cardId, cardState) {
  state.userState.set(cardId, cardState);
  localStorage.setItem(`${STORAGE_PREFIX}${cardId}`, JSON.stringify(cardState));
}

function getCardState(cardId) {
  return state.userState.get(cardId) || defaultCardState();
}

function getSelectedCard() {
  return state.cards.find((card) => card.id === state.selectedCardId) || null;
}

function getSelectedCardState() {
  return state.selectedCardId ? getCardState(state.selectedCardId) : defaultCardState();
}

function updateSelectedCardState(patch, options = {}) {
  const card = getSelectedCard();
  if (!card) {
    return;
  }

  const nextState = {
    ...getCardState(card.id),
    ...patch,
  };

  saveCardState(card.id, nextState);
  if (!options.silent) {
    showSyncStatus("卡片紀錄已更新");
  }
  renderStats();
  renderCardBadgesForVisibleTile(card.id);
  syncDialogState(card, nextState);
  render();
}

function render() {
  if (!state.cards.length) {
    return;
  }

  updateSegmentedButtons();
  renderStats();
  renderGrid();
}

function renderStats() {
  const allStates = state.cards.map((card) => getCardState(card.id));
  const owned = allStates.filter((item) => item.owned).length;
  const wanted = allStates.filter((item) => item.wanted).length;
  const favorite = allStates.filter((item) => item.favorite).length;

  elements.totalCount.textContent = String(state.cards.length);
  elements.ownedCount.textContent = String(owned);
  elements.wantedCount.textContent = String(wanted);
  elements.favoriteCount.textContent = String(favorite);
}

function renderGrid() {
  const cards = getFilteredCards();
  state.filteredCards = cards;

  elements.cardGrid.textContent = "";
  elements.emptyState.hidden = cards.length !== 0;
  elements.cardGrid.hidden = cards.length === 0;

  const viewLabel = state.currentView === "favorites" ? "收藏夾" : "全部圖鑑";
  elements.resultSummary.textContent = `${viewLabel} 共顯示 ${cards.length} / ${state.cards.length} 張卡片`;

  const fragment = document.createDocumentFragment();
  cards.forEach((card) => {
    const cardState = getCardState(card.id);
    const node = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".card-tile__button");
    const image = node.querySelector(".card-tile__image");
    const badges = node.querySelector(".card-tile__badges");
    const name = node.querySelector(".card-tile__name");
    const character = node.querySelector(".card-tile__character");
    const generation = node.querySelector(".card-tile__generation");

    node.dataset.cardId = card.id;
    image.src = card.frontImage;
    image.alt = `${card.name} 正面圖`;
    name.textContent = card.name;
    character.textContent = card.character;
    generation.textContent = `${card.generation} ・ ${card.category}`;
    badges.replaceChildren(...buildBadges(cardState));

    button.addEventListener("click", () => openDialog(card.id));
    fragment.appendChild(node);
  });

  elements.cardGrid.appendChild(fragment);
}

function getFilteredCards() {
  const search = state.filters.search;

  return state.cards.filter((card) => {
    const cardState = getCardState(card.id);

    if (state.currentView === "favorites" && !cardState.favorite) {
      return false;
    }

    if (state.filters.generation && card.generation !== state.filters.generation) {
      return false;
    }

    if (state.filters.character && card.character !== state.filters.character) {
      return false;
    }

    if (state.filters.owned === "owned" && !cardState.owned) {
      return false;
    }

    if (state.filters.owned === "unowned" && cardState.owned) {
      return false;
    }

    if (state.filters.wantedOnly && !cardState.wanted) {
      return false;
    }

    if (state.filters.favoriteOnly && !cardState.favorite) {
      return false;
    }

    if (search) {
      const target = `${card.name} ${card.character}`.toLowerCase();
      if (!target.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

function buildBadges(cardState) {
  const badges = [];
  if (cardState.owned) {
    badges.push(makeBadge("已擁有", "badge--owned"));
  }
  if (cardState.wanted) {
    badges.push(makeBadge("想要", "badge--wanted"));
  }
  if (cardState.favorite) {
    badges.push(makeBadge("收藏", "badge--favorite"));
  }
  return badges;
}

function makeBadge(label, className) {
  const badge = document.createElement("span");
  badge.className = `badge ${className}`;
  badge.textContent = label;
  return badge;
}

function renderCardBadgesForVisibleTile(cardId) {
  const tile = elements.cardGrid.querySelector(`[data-card-id="${CSS.escape(cardId)}"]`);
  if (!tile) {
    return;
  }

  const badges = tile.querySelector(".card-tile__badges");
  badges.replaceChildren(...buildBadges(getCardState(cardId)));
}

function populateFilterOptions() {
  const generations = [...new Set(state.cards.map((card) => card.generation))].sort();
  const characters = [...new Set(state.cards.map((card) => card.character))].sort((a, b) => a.localeCompare(b, "ja"));

  appendOptions(elements.generationFilter, generations, "全部代數");
  appendOptions(elements.characterFilter, characters, "全部角色");
}

function appendOptions(select, values, defaultLabel) {
  select.innerHTML = "";
  select.appendChild(new Option(defaultLabel, ""));
  values.forEach((value) => {
    select.appendChild(new Option(value, value));
  });
}

function updateSegmentedButtons() {
  elements.segmentedButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.currentView);
  });
}

function openDialog(cardId) {
  state.selectedCardId = cardId;
  state.selectedImageSide = "front";
  const card = getSelectedCard();
  const cardState = getSelectedCardState();
  if (!card) {
    return;
  }

  elements.dialogCode.textContent = card.id;
  elements.dialogName.textContent = card.name;
  elements.dialogMeta.textContent = `${card.character} ・ ${card.generation}`;
  elements.dialogCharacter.textContent = card.character;
  elements.dialogGeneration.textContent = card.generation;
  elements.dialogCategory.textContent = card.category;
  switchDialogImage("front");
  syncDialogState(card, cardState);

  if (!elements.cardDialog.open) {
    elements.cardDialog.showModal();
  }
}

function syncDialogState(card, cardState) {
  if (!card || state.selectedCardId !== card.id) {
    return;
  }

  elements.ownedCheckbox.checked = cardState.owned;
  elements.wantedCheckbox.checked = cardState.wanted;
  elements.favoriteButton.classList.toggle("is-active", cardState.favorite);
  elements.favoriteButton.textContent = cardState.favorite ? "已收藏" : "加入收藏";
  elements.noteTextarea.value = cardState.note;
}

function switchDialogImage(side) {
  state.selectedImageSide = side;
  const card = getSelectedCard();
  if (!card) {
    return;
  }

  const imageSource = side === "back" ? card.backImage : card.frontImage;
  const imageLabel = side === "back" ? "反面圖" : "正面圖";
  elements.dialogImage.src = imageSource;
  elements.dialogImage.alt = `${card.name} ${imageLabel}`;
  elements.showFrontButton.classList.toggle("is-active", side === "front");
  elements.showBackButton.classList.toggle("is-active", side === "back");
}

function resetFilters() {
  state.filters = {
    search: "",
    generation: "",
    character: "",
    owned: "",
    wantedOnly: false,
    favoriteOnly: false,
  };

  elements.searchInput.value = "";
  elements.generationFilter.value = "";
  elements.characterFilter.value = "";
  elements.ownedFilter.value = "";
  elements.wantedOnlyFilter.checked = false;
  elements.favoriteOnlyFilter.checked = false;
  state.currentView = "all";
  updateSegmentedButtons();
  render();
}

function exportState() {
  const payload = {
    app: "aipri-card-dex",
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    cards: Object.fromEntries(
      state.cards
        .map((card) => [card.id, getCardState(card.id)])
        .filter(([, cardState]) => cardState.owned || cardState.wanted || cardState.favorite || cardState.note)
    ),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateTag = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `aipri-card-backup-${dateTag}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showSyncStatus("備份匯出完成");
}

async function importStateFromFile(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const importedCards = payload.cards || {};

    Object.entries(importedCards).forEach(([cardId, importedState]) => {
      const nextState = {
        owned: Boolean(importedState.owned),
        wanted: Boolean(importedState.wanted),
        favorite: Boolean(importedState.favorite),
        note: typeof importedState.note === "string" ? importedState.note : "",
      };
      saveCardState(cardId, nextState);
    });

    if (state.selectedCardId) {
      const selectedCard = getSelectedCard();
      syncDialogState(selectedCard, getSelectedCardState());
    }

    render();
    showSyncStatus("備份匯入完成");
  } catch (error) {
    console.error(error);
    showSyncStatus("匯入失敗，請確認 JSON 格式");
  } finally {
    event.target.value = "";
  }
}

function showSyncStatus(message) {
  elements.syncStatus.textContent = message;
  clearTimeout(showSyncStatus.timerId);
  showSyncStatus.timerId = setTimeout(() => {
    elements.syncStatus.textContent = "";
  }, 2200);
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register("service-worker.js");
  } catch (error) {
    console.warn("Service Worker 註冊失敗", error);
  }
}

async function prewarmShellCache() {
  if (!("caches" in window)) {
    return;
  }

  try {
    const cache = await caches.open("aipri-app-shell-v1");
    await cache.addAll(APP_SHELL_FILES);
  } catch (error) {
    console.warn("預快取失敗", error);
  }
}

function handleBeforeInstallPrompt(event) {
  event.preventDefault();
  state.deferredInstallPrompt = event;
  elements.installButton.classList.remove("pill-button--hidden");
}

async function promptInstall() {
  if (!state.deferredInstallPrompt) {
    return;
  }

  state.deferredInstallPrompt.prompt();
  await state.deferredInstallPrompt.userChoice;
  state.deferredInstallPrompt = null;
  elements.installButton.classList.add("pill-button--hidden");
}
