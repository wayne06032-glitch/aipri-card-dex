import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const webDir = path.join(projectRoot, "www");

const filesToCopy = [
  "index.html",
  "style.css",
  "app.js",
  "cards.json",
  "cards-data.js",
  "manifest.json",
  "service-worker.js",
  ".nojekyll",
];

const directoriesToCopy = ["icons", "images"];

build();

function build() {
  fs.rmSync(webDir, { recursive: true, force: true });
  fs.mkdirSync(webDir, { recursive: true });

  for (const file of filesToCopy) {
    copyEntry(file, file);
  }

  for (const directory of directoriesToCopy) {
    copyEntry(directory, directory);
  }

  console.log("www build completed.");
}

function copyEntry(sourceRelativePath, destinationRelativePath) {
  const sourcePath = path.join(projectRoot, sourceRelativePath);
  const destinationPath = path.join(webDir, destinationRelativePath);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source: ${sourceRelativePath}`);
  }

  fs.cpSync(sourcePath, destinationPath, {
    recursive: true,
    force: true,
  });
}
