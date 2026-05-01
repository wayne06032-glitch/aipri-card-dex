const STORAGE_PREFIX = "aipri_card_state_";
const EXPORT_VERSION = 2;
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

const MAX_NOTE_LENGTH = 200;
const DEFAULT_NOTE_PREVIEW_LENGTH = 16;

const state = {
  cards: [],
  userState: new Map(),
  filteredCards: [],
  selectedCardId: null,
  selectedImageSide: "front",
  currentView: "all",
  activeNav: "library",
  filterPanelOpen: false,
  filters: {
    search: "",
    generation: "",
    character: "",
    category: "",
    stars: "",
    ownership: "",
    favoriteOnly: false,
  },
  deferredInstallPrompt: null,
  noteSaveTimer: null,
};

const elements = {
  totalCount: document.getElementById("totalCount"),
  totalCountMeta: document.getElementById("totalCountMeta"),
  jpOwnedCount: document.getElementById("jpOwnedCount"),
  jpOwnedMeta: document.getElementById("jpOwnedMeta"),
  twOwnedCount: document.getElementById("twOwnedCount"),
  twOwnedMeta: document.getElementById("twOwnedMeta"),
  favoriteCount: document.getElementById("favoriteCount"),
  favoriteCountMeta: document.getElementById("favoriteCountMeta"),
  searchSection: document.getElementById("searchSection"),
  searchInput: document.getElementById("searchInput"),
  openFilterButton: document.getElementById("openFilterButton"),
  scrollToSearchButton: document.getElementById("scrollToSearchButton"),
  toggleFilterPanelButton: document.getElementById("toggleFilterPanelButton"),
  filterPanel: document.getElementById("filterPanel"),
  generationFilter: document.getElementById("generationFilter"),
  characterFilter: document.getElementById("characterFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  starsFilter: document.getElementById("starsFilter"),
  ownershipFilter: document.getElementById("ownershipFilter"),
  favoriteOnlyFilter: document.getElementById("favoriteOnlyFilter"),
  quickPills: Array.from(document.querySelectorAll(".quick-pill")),
  filterChips: Array.from(document.querySelectorAll(".filter-chip")),
  resetFiltersButton: document.getElementById("resetFiltersButton"),
  exportButton: document.getElementById("exportButton"),
  importButton: document.getElementById("importButton"),
  importFileInput: document.getElementById("importFileInput"),
  installButton: document.getElementById("installButton"),
  resultSummary: document.getElementById("resultSummary"),
  activeFilterSummary: document.getElementById("activeFilterSummary"),
  syncStatus: document.getElementById("syncStatus"),
  cardGrid: document.getElementById("cardGrid"),
  emptyState: document.getElementById("emptyState"),
  cardTemplate: document.getElementById("cardTemplate"),
  statsSection: document.getElementById("statsSection"),
  statsTotalCards: document.getElementById("statsTotalCards"),
  statsFavorites: document.getElementById("statsFavorites"),
  statsJpOwned: document.getElementById("statsJpOwned"),
  statsTwOwned: document.getElementById("statsTwOwned"),
  statsWishlist: document.getElementById("statsWishlist"),
  ownedStatText: document.getElementById("ownedStatText"),
  partialStatText: document.getElementById("partialStatText"),
  noneStatText: document.getElementById("noneStatText"),
  jpMissingStatText: document.getElementById("jpMissingStatText"),
  twMissingStatText: document.getElementById("twMissingStatText"),
  ownedStatBar: document.getElementById("ownedStatBar"),
  partialStatBar: document.getElementById("partialStatBar"),
  noneStatBar: document.getElementById("noneStatBar"),
  jpMissingStatBar: document.getElementById("jpMissingStatBar"),
  twMissingStatBar: document.getElementById("twMissingStatBar"),
  bottomNavButtons: Array.from(document.querySelectorAll(".bottom-nav__button")),
  cardDialog: document.getElementById("cardDialog"),
  closeDialogButton: document.getElementById("closeDialogButton"),
  previousCardButton: document.getElementById("previousCardButton"),
  nextCardButton: document.getElementById("nextCardButton"),
  dialogPreviousButton: document.getElementById("dialogPreviousButton"),
  dialogNextButton: document.getElementById("dialogNextButton"),
  dialogImage: document.getElementById("dialogImage"),
  dialogDots: Array.from(document.querySelectorAll(".dialog-dot")),
  dialogCode: document.getElementById("dialogCode"),
  dialogName: document.getElementById("dialogName"),
  dialogMeta: document.getElementById("dialogMeta"),
  dialogStatusBadges: document.getElementById("dialogStatusBadges"),
  showFrontButton: document.getElementById("showFrontButton"),
  showBackButton: document.getElementById("showBackButton"),
  jpCountInput: document.getElementById("jpCountInput"),
  twCountInput: document.getElementById("twCountInput"),
  favoriteButton: document.getElementById("favoriteButton"),
  favoriteSwitch: document.getElementById("favoriteSwitch"),
  favoriteSwitchRow: document.querySelector(".switch-row"),
  noteTextarea: document.getElementById("noteTextarea"),
  noteCounter: document.getElementById("noteCounter"),
  stepperButtons: Array.from(document.querySelectorAll(".stepper__button")),
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

  elements.categoryFilter.addEventListener("change", (event) => {
    state.filters.category = event.target.value;
    render();
  });

  elements.starsFilter.addEventListener("change", (event) => {
    state.filters.stars = event.target.value;
    syncChipGroup("stars", state.filters.stars);
    render();
  });

  elements.ownershipFilter.addEventListener("change", (event) => {
    state.filters.ownership = event.target.value;
    syncChipGroup("ownership", state.filters.ownership);
    syncQuickOwnershipButtons();
    render();
  });

  elements.favoriteOnlyFilter.addEventListener("change", (event) => {
    state.filters.favoriteOnly = event.target.checked;
    render();
  });

  elements.quickPills.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.view) {
        state.currentView = button.dataset.view;
        state.activeNav = button.dataset.view === "favorites" ? "favorites" : "library";
        updateActiveNav();
      }

      if (Object.prototype.hasOwnProperty.call(button.dataset, "ownershipFilter")) {
        state.filters.ownership = button.dataset.ownershipFilter;
        elements.ownershipFilter.value = state.filters.ownership;
        syncChipGroup("ownership", state.filters.ownership);
      }

      updateQuickPills();
      render();
    });
  });

  elements.filterChips.forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.chipGroup;
      const value = button.dataset.chipValue;
      if (group === "stars") {
        state.filters.stars = value;
        elements.starsFilter.value = value;
      }
      if (group === "ownership") {
        state.filters.ownership = value;
        elements.ownershipFilter.value = value;
        syncQuickOwnershipButtons();
      }
      syncChipGroup(group, value);
      render();
    });
  });

  elements.openFilterButton.addEventListener("click", toggleFilterPanel);
  elements.toggleFilterPanelButton.addEventListener("click", toggleFilterPanel);
  elements.scrollToSearchButton.addEventListener("click", () => {
    elements.searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
    elements.searchInput.focus();
  });

  elements.resetFiltersButton.addEventListener("click", resetFilters);
  elements.exportButton.addEventListener("click", exportState);
  elements.importButton.addEventListener("click", () => elements.importFileInput.click());
  elements.importFileInput.addEventListener("change", importStateFromFile);
  elements.installButton.addEventListener("click", promptInstall);
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  elements.bottomNavButtons.forEach((button) => {
    button.addEventListener("click", () => handleBottomNav(button.dataset.nav));
  });

  elements.showFrontButton.addEventListener("click", () => switchDialogImage("front"));
  elements.showBackButton.addEventListener("click", () => switchDialogImage("back"));

  elements.closeDialogButton.addEventListener("click", () => elements.cardDialog.close());
  elements.previousCardButton.addEventListener("click", () => navigateSelectedCard(-1));
  elements.nextCardButton.addEventListener("click", () => navigateSelectedCard(1));
  elements.dialogPreviousButton.addEventListener("click", () => navigateSelectedCard(-1));
  elements.dialogNextButton.addEventListener("click", () => navigateSelectedCard(1));

  elements.jpCountInput.addEventListener("input", (event) => {
    updateSelectedCardState({ jpCount: sanitizeCount(event.target.value) });
  });

  elements.twCountInput.addEventListener("input", (event) => {
    updateSelectedCardState({ twCount: sanitizeCount(event.target.value) });
  });

  elements.stepperButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.stepTarget;
      const delta = Number.parseInt(button.dataset.stepDelta, 10) || 0;
      const selectedState = getSelectedCardState();
      const key = target === "tw" ? "twCount" : "jpCount";
      updateSelectedCardState({ [key]: Math.max(0, selectedState[key] + delta) });
    });
  });

  elements.favoriteButton.addEventListener("click", toggleSelectedFavorite);
  elements.favoriteSwitch.addEventListener("change", toggleSelectedFavorite);

  elements.noteTextarea.addEventListener("input", (event) => {
    const note = event.target.value.slice(0, MAX_NOTE_LENGTH);
    updateNoteCounter(note);
    clearTimeout(state.noteSaveTimer);
    state.noteSaveTimer = setTimeout(() => {
      updateSelectedCardState({ note }, { silent: true });
      showSyncStatus("備註已更新");
    }, 180);
  });

  elements.cardDialog.addEventListener("close", () => {
    state.selectedCardId = null;
    state.selectedImageSide = "front";
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
      "讀取卡片資料失敗，請改用本機靜態伺服器或重新整理後再試。";
    showSyncStatus("卡片資料載入失敗");
  }
}

async function loadCardsData() {
  if (Array.isArray(window.__AIPRI_CARDS__) && window.__AIPRI_CARDS__.length > 0) {
    return window.__AIPRI_CARDS__;
  }

  const response = await fetch("cards.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`讀取 cards.json 失敗：${response.status}`);
  }

  return response.json();
}

function normalizeCard(card) {
  return {
    id: String(card.id || ""),
    name: typeof card.name === "string" && card.name.trim() ? card.name.trim() : "未命名卡片",
    character: typeof card.character === "string" && card.character.trim() ? card.character.trim() : "未知角色",
    generation:
      typeof card.generation === "string" && card.generation.trim() ? card.generation.trim() : "未知代數",
    category:
      typeof card.category === "string" && card.category.trim() ? card.category.trim() : "未分類",
    stars: Number.isInteger(card.stars) ? card.stars : parseNullableInt(card.stars),
    frontImage: card.frontImage,
    backImage: card.backImage || card.frontImage,
  };
}

function parseNullableInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function hydrateAllUserState() {
  state.userState.clear();
  state.cards.forEach((card) => {
    const { nextState, migrated } = parseStoredState(card.id);
    state.userState.set(card.id, nextState);
    if (migrated) {
      saveCardState(card.id, nextState);
    }
  });
}

function parseStoredState(cardId) {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${cardId}`);
  if (!raw) {
    return { nextState: defaultCardState(), migrated: false };
  }

  try {
    const parsed = JSON.parse(raw);
    const hasNewShape =
      Object.prototype.hasOwnProperty.call(parsed, "jpCount") ||
      Object.prototype.hasOwnProperty.call(parsed, "twCount");

    if (hasNewShape) {
      return {
        nextState: {
          jpCount: sanitizeCount(parsed.jpCount),
          twCount: sanitizeCount(parsed.twCount),
          favorite: Boolean(parsed.favorite),
          note: typeof parsed.note === "string" ? parsed.note : "",
        },
        migrated: false,
      };
    }

    return {
      nextState: {
        jpCount: parsed.owned ? 1 : 0,
        twCount: 0,
        favorite: Boolean(parsed.favorite),
        note: typeof parsed.note === "string" ? parsed.note : "",
      },
      migrated: true,
    };
  } catch (error) {
    console.warn(`卡片 ${cardId} 狀態解析失敗`, error);
    return { nextState: defaultCardState(), migrated: false };
  }
}

function defaultCardState() {
  return {
    jpCount: 0,
    twCount: 0,
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

function sanitizeCount(value) {
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
}

function toggleSelectedFavorite() {
  const selectedState = getSelectedCardState();
  updateSelectedCardState({ favorite: !selectedState.favorite });
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

  nextState.jpCount = sanitizeCount(nextState.jpCount);
  nextState.twCount = sanitizeCount(nextState.twCount);
  nextState.note = (nextState.note || "").slice(0, MAX_NOTE_LENGTH);

  saveCardState(card.id, nextState);
  if (!options.silent) {
    showSyncStatus("收藏狀態已更新");
  }

  render();
  syncDialogState(card, nextState);
}

function render() {
  if (!state.cards.length) {
    return;
  }

  state.filteredCards = getFilteredCards();
  updateQuickPills();
  updateActiveNav();
  updateFilterSummary();
  renderStats();
  renderGrid();
}

function renderStats() {
  const totalCards = state.cards.length;
  const allStates = state.cards.map((card) => getCardState(card.id));
  const jpOwned = allStates.filter((item) => item.jpCount > 0).length;
  const twOwned = allStates.filter((item) => item.twCount > 0).length;
  const favorite = allStates.filter((item) => item.favorite).length;
  const owned = allStates.filter(isOwnedState).length;
  const partial = allStates.filter(isPartialState).length;
  const none = allStates.filter((item) => item.jpCount === 0 && item.twCount === 0).length;
  const jpMissing = allStates.filter((item) => item.jpCount === 0).length;
  const twMissing = allStates.filter((item) => item.twCount === 0).length;

  elements.totalCount.textContent = String(totalCards);
  elements.totalCountMeta.textContent = `/ ${totalCards}`;
  elements.jpOwnedCount.textContent = String(jpOwned);
  elements.jpOwnedMeta.textContent = `/ ${totalCards}`;
  elements.twOwnedCount.textContent = String(twOwned);
  elements.twOwnedMeta.textContent = `/ ${totalCards}`;
  elements.favoriteCount.textContent = String(favorite);
  elements.favoriteCountMeta.textContent = `/ ${totalCards}`;

  elements.statsTotalCards.textContent = String(totalCards);
  elements.statsFavorites.textContent = String(favorite);
  elements.statsJpOwned.textContent = String(jpOwned);
  elements.statsTwOwned.textContent = String(twOwned);
  elements.statsWishlist.textContent = String(favorite);

  renderProgressStat(elements.ownedStatText, elements.ownedStatBar, owned, totalCards);
  renderProgressStat(elements.partialStatText, elements.partialStatBar, partial, totalCards);
  renderProgressStat(elements.noneStatText, elements.noneStatBar, none, totalCards);
  renderProgressStat(elements.jpMissingStatText, elements.jpMissingStatBar, jpMissing, totalCards);
  renderProgressStat(elements.twMissingStatText, elements.twMissingStatBar, twMissing, totalCards);
}

function renderProgressStat(textElement, barElement, value, total) {
  const percent = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
  textElement.textContent = `${value} (${percent}%)`;
  barElement.style.width = `${Math.min(100, percent)}%`;
}

function renderGrid() {
  const cards = state.filteredCards;
  elements.cardGrid.textContent = "";
  elements.emptyState.hidden = cards.length !== 0;
  elements.cardGrid.hidden = cards.length === 0;
  elements.resultSummary.textContent = `顯示 ${cards.length} / ${state.cards.length} 張卡片`;

  const fragment = document.createDocumentFragment();

  cards.forEach((card) => {
    const cardState = getCardState(card.id);
    const node = elements.cardTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".card-tile__button");
    const codeBadge = node.querySelector(".card-code-badge");
    const favorite = node.querySelector(".card-favorite");
    const counts = node.querySelector(".card-tile__counts");
    const image = node.querySelector(".card-tile__image");
    const stars = node.querySelector(".card-tile__stars");
    const name = node.querySelector(".card-tile__name");
    const meta = node.querySelector(".card-tile__meta");
    const note = node.querySelector(".card-tile__note");

    node.dataset.cardId = card.id;
    codeBadge.textContent = normalizeDisplayCode(card.id);
    favorite.textContent = cardState.favorite ? "♥" : "♡";
    favorite.classList.toggle("is-active", cardState.favorite);
    counts.textContent = formatOwnershipSummary(cardState);
    counts.className = `card-tile__counts ${getOwnershipCountClass(cardState)}`;
    image.src = card.frontImage;
    image.alt = `${card.name} 卡面`;
    stars.textContent = formatStars(card.stars);
    name.textContent = card.name;
    meta.textContent = `${card.character} ｜ ${card.generation} ｜ ${card.category}`;

    const notePreview = buildNotePreview(cardState.note);
    note.hidden = !notePreview;
    note.textContent = notePreview;

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

    if (state.filters.character && card.character !== state.filters.character) {
      return false;
    }

    if (state.filters.generation && card.generation !== state.filters.generation) {
      return false;
    }

    if (state.filters.category && card.category !== state.filters.category) {
      return false;
    }

    if (state.filters.stars) {
      if (state.filters.stars === "unknown") {
        if (card.stars !== null) {
          return false;
        }
      } else {
        const targetStars = Number.parseInt(state.filters.stars, 10);
        if (!card.stars || card.stars !== targetStars) {
          return false;
        }
      }
    }

    if (!matchesOwnershipFilter(cardState, state.filters.ownership)) {
      return false;
    }

    if (state.filters.favoriteOnly && !cardState.favorite) {
      return false;
    }

    if (search) {
      const target = `${card.name} ${card.character} ${card.id}`.toLowerCase();
      if (!target.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

function matchesOwnershipFilter(cardState, ownership) {
  if (!ownership) {
    return true;
  }

  if (ownership === "owned") {
    return isOwnedState(cardState);
  }

  if (ownership === "partial") {
    return isPartialState(cardState);
  }

  if (ownership === "none") {
    return cardState.jpCount === 0 && cardState.twCount === 0;
  }

  if (ownership === "jp-missing") {
    return cardState.jpCount === 0;
  }

  if (ownership === "tw-missing") {
    return cardState.twCount === 0;
  }

  if (ownership === "favorite") {
    return cardState.favorite;
  }

  return true;
}

function isOwnedState(cardState) {
  return cardState.jpCount > 0 && cardState.twCount > 0;
}

function isPartialState(cardState) {
  const total = cardState.jpCount + cardState.twCount;
  return total > 0 && !isOwnedState(cardState);
}

function buildNotePreview(note) {
  if (!note) {
    return "";
  }

  return note.length > DEFAULT_NOTE_PREVIEW_LENGTH
    ? `${note.slice(0, DEFAULT_NOTE_PREVIEW_LENGTH)}...`
    : note;
}

function formatOwnershipSummary(cardState) {
  if (cardState.jpCount === 0 && cardState.twCount === 0) {
    return "未持有";
  }

  return `JP ${cardState.jpCount} ｜ TW ${cardState.twCount}`;
}

function getOwnershipCountClass(cardState) {
  if (isOwnedState(cardState)) {
    return "card-tile__counts--owned";
  }

  if (isPartialState(cardState)) {
    return "card-tile__counts--partial";
  }

  return "card-tile__counts--empty";
}

function buildStatusBadgeNodes(cardState) {
  const statusItems = [];

  if (isOwnedState(cardState)) {
    statusItems.push({ label: "已持有", className: "status-badge status-badge--owned" });
  } else if (isPartialState(cardState)) {
    statusItems.push({ label: "部分持有", className: "status-badge status-badge--partial" });
  } else {
    statusItems.push({ label: "未持有", className: "status-badge status-badge--none" });
  }

  if (cardState.jpCount === 0) {
    statusItems.push({ label: "JP 未持有", className: "status-badge status-badge--jp" });
  }

  if (cardState.twCount === 0) {
    statusItems.push({ label: "TW 未持有", className: "status-badge status-badge--tw" });
  }

  if (cardState.favorite) {
    statusItems.push({ label: "已收藏", className: "status-badge status-badge--favorite" });
  }

  return statusItems.map((item) => {
    const badge = document.createElement("span");
    badge.className = item.className;
    badge.textContent = item.label;
    return badge;
  });
}

function formatStars(stars) {
  if (!stars) {
    return "未知星數";
  }

  return "★".repeat(stars);
}

function normalizeDisplayCode(cardId) {
  return cardId.startsWith("No.") ? cardId : `No.${cardId}`;
}

function populateFilterOptions() {
  const generations = [...new Set(state.cards.map((card) => card.generation))].sort();
  const characters = [...new Set(state.cards.map((card) => card.character))].sort((a, b) =>
    a.localeCompare(b, "ja")
  );
  const categories = [...new Set(state.cards.map((card) => card.category))].sort();

  appendOptions(elements.characterFilter, characters, "全部");
  appendOptions(elements.generationFilter, generations, "全部");
  appendOptions(elements.categoryFilter, categories, "全部");
}

function appendOptions(select, values, defaultLabel) {
  select.innerHTML = "";
  select.appendChild(new Option(defaultLabel, ""));
  values.forEach((value) => {
    select.appendChild(new Option(value, value));
  });
}

function updateQuickPills() {
  elements.quickPills.forEach((button) => {
    const matchesView = button.dataset.view && button.dataset.view === state.currentView;
    const matchesOwnership =
      Object.prototype.hasOwnProperty.call(button.dataset, "ownershipFilter") &&
      button.dataset.ownershipFilter === state.filters.ownership;
    const defaultAll =
      button.dataset.view === "all" && state.currentView === "all" && !state.filters.ownership;
    button.classList.toggle("is-active", matchesView || matchesOwnership || defaultAll);
  });
}

function syncQuickOwnershipButtons() {
  elements.quickPills.forEach((button) => {
    if (Object.prototype.hasOwnProperty.call(button.dataset, "ownershipFilter")) {
      button.classList.toggle("is-active", button.dataset.ownershipFilter === state.filters.ownership);
    }
  });
}

function syncChipGroup(group, value) {
  elements.filterChips.forEach((chip) => {
    if (chip.dataset.chipGroup === group) {
      chip.classList.toggle("is-active", chip.dataset.chipValue === value);
    }
  });
}

function updateFilterSummary() {
  const summary = [];
  if (state.filters.search) {
    summary.push(`搜尋「${state.filters.search}」`);
  }
  if (state.filters.character) {
    summary.push(`角色：${state.filters.character}`);
  }
  if (state.filters.generation) {
    summary.push(`代數：${state.filters.generation}`);
  }
  if (state.filters.category) {
    summary.push(`分類：${state.filters.category}`);
  }
  if (state.filters.stars) {
    summary.push(state.filters.stars === "unknown" ? "星數：未知" : `星數：${state.filters.stars}★`);
  }
  if (state.filters.ownership) {
    summary.push(`狀態：${ownershipLabel(state.filters.ownership)}`);
  }
  if (state.filters.favoriteOnly) {
    summary.push("只看收藏");
  }
  if (state.currentView === "favorites") {
    summary.push("收藏分頁");
  }

  elements.activeFilterSummary.textContent =
    summary.length > 0 ? summary.join(" ｜ ") : "目前顯示全部卡片";
}

function ownershipLabel(value) {
  const labels = {
    owned: "已持有",
    partial: "部分持有",
    none: "未持有",
    "jp-missing": "JP 未持有",
    "tw-missing": "TW 未持有",
    favorite: "收藏",
  };
  return labels[value] || "全部";
}

function toggleFilterPanel() {
  state.filterPanelOpen = !state.filterPanelOpen;
  elements.filterPanel.hidden = !state.filterPanelOpen;
}

function handleBottomNav(nav) {
  state.activeNav = nav;

  if (nav === "library") {
    state.currentView = "all";
    updateQuickPills();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (nav === "favorites") {
    state.currentView = "favorites";
    updateQuickPills();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (nav === "stats") {
    updateActiveNav();
    elements.statsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (nav === "filters") {
    if (elements.filterPanel.hidden) {
      state.filterPanelOpen = true;
      elements.filterPanel.hidden = false;
    }
    updateActiveNav();
    elements.searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateActiveNav() {
  elements.bottomNavButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === state.activeNav);
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

  elements.dialogCode.textContent = normalizeDisplayCode(card.id);
  elements.dialogName.textContent = card.name;
  elements.dialogMeta.textContent = `${card.character} ｜ ${card.generation} ｜ ${card.category}`;
  syncDialogState(card, cardState);
  switchDialogImage("front");

  if (!elements.cardDialog.open) {
    elements.cardDialog.showModal();
  }
}

function syncDialogState(card, cardState) {
  if (!card || state.selectedCardId !== card.id) {
    return;
  }

  elements.jpCountInput.value = String(cardState.jpCount);
  elements.twCountInput.value = String(cardState.twCount);
  elements.favoriteButton.classList.toggle("is-active", cardState.favorite);
  elements.favoriteButton.setAttribute("aria-pressed", String(cardState.favorite));
  elements.favoriteButton.textContent = cardState.favorite ? "♥" : "♡";
  elements.favoriteSwitch.checked = cardState.favorite;
  elements.favoriteSwitchRow.classList.toggle("is-active", cardState.favorite);
  elements.noteTextarea.value = cardState.note;
  elements.dialogStatusBadges.replaceChildren(...buildStatusBadgeNodes(cardState));
  updateNoteCounter(cardState.note);
}

function switchDialogImage(side) {
  state.selectedImageSide = side;
  const card = getSelectedCard();
  if (!card) {
    return;
  }

  const source = side === "back" ? card.backImage : card.frontImage;
  elements.dialogImage.src = source;
  elements.dialogImage.alt = `${card.name} ${side === "back" ? "背面" : "正面"}`;
  elements.showFrontButton.classList.toggle("is-active", side === "front");
  elements.showBackButton.classList.toggle("is-active", side === "back");
  elements.dialogDots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.dot === side);
  });
}

function navigateSelectedCard(direction) {
  const currentIndex = state.filteredCards.findIndex((card) => card.id === state.selectedCardId);
  if (currentIndex === -1 || state.filteredCards.length === 0) {
    return;
  }

  const nextIndex = (currentIndex + direction + state.filteredCards.length) % state.filteredCards.length;
  openDialog(state.filteredCards[nextIndex].id);
}

function resetFilters() {
  state.filters = {
    search: "",
    generation: "",
    character: "",
    category: "",
    stars: "",
    ownership: "",
    favoriteOnly: false,
  };

  state.currentView = "all";
  state.activeNav = "library";
  elements.searchInput.value = "";
  elements.characterFilter.value = "";
  elements.generationFilter.value = "";
  elements.categoryFilter.value = "";
  elements.starsFilter.value = "";
  elements.ownershipFilter.value = "";
  elements.favoriteOnlyFilter.checked = false;
  syncChipGroup("stars", "");
  syncChipGroup("ownership", "");
  updateQuickPills();
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
        .filter(([, cardState]) => {
          return cardState.jpCount > 0 || cardState.twCount > 0 || cardState.favorite || cardState.note;
        })
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
  showSyncStatus("已匯出收藏資料");
}

async function importStateFromFile(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    const payload = JSON.parse(await file.text());
    const importedCards = payload.cards || {};

    Object.entries(importedCards).forEach(([cardId, importedState]) => {
      saveCardState(cardId, normalizeImportedState(importedState));
    });

    if (state.selectedCardId) {
      const selectedCard = getSelectedCard();
      syncDialogState(selectedCard, getSelectedCardState());
    }

    render();
    showSyncStatus("已匯入收藏資料");
  } catch (error) {
    console.error(error);
    showSyncStatus("匯入失敗，請確認 JSON 格式是否正確");
  } finally {
    event.target.value = "";
  }
}

function normalizeImportedState(importedState) {
  const usingNewShape =
    Object.prototype.hasOwnProperty.call(importedState, "jpCount") ||
    Object.prototype.hasOwnProperty.call(importedState, "twCount");

  if (usingNewShape) {
    return {
      jpCount: sanitizeCount(importedState.jpCount),
      twCount: sanitizeCount(importedState.twCount),
      favorite: Boolean(importedState.favorite),
      note: typeof importedState.note === "string" ? importedState.note.slice(0, MAX_NOTE_LENGTH) : "",
    };
  }

  return {
    jpCount: importedState.owned ? 1 : 0,
    twCount: 0,
    favorite: Boolean(importedState.favorite),
    note: typeof importedState.note === "string" ? importedState.note.slice(0, MAX_NOTE_LENGTH) : "",
  };
}

function updateNoteCounter(note) {
  elements.noteCounter.textContent = `${note.length} / ${MAX_NOTE_LENGTH}`;
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
    console.warn("預熱快取失敗", error);
  }
}

function handleBeforeInstallPrompt(event) {
  event.preventDefault();
  state.deferredInstallPrompt = event;
  elements.installButton.classList.remove("is-hidden");
}

async function promptInstall() {
  if (!state.deferredInstallPrompt) {
    return;
  }

  state.deferredInstallPrompt.prompt();
  await state.deferredInstallPrompt.userChoice;
  state.deferredInstallPrompt = null;
  elements.installButton.classList.add("is-hidden");
}
