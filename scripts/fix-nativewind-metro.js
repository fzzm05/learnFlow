const fs = require("fs");
const path = require("path");

const targetFile = path.join(
  process.cwd(),
  "node_modules",
  "react-native-css-interop",
  "src",
  "metro",
  "index.ts"
);

const brokenSnippet = `        haste.emit("change", {
          eventsQueue: [
            {
              filePath,
              metadata: {
                modifiedTime: Date.now(),
                size: 1, // Can be anything
                type: "virtual", // Can be anything
              },
              type: "change",
            },
          ],
        });`;

const fixedSnippet = `        const metadata = {
          modifiedTime: Date.now(),
          size: 1,
          type: "virtual",
        };

        haste.emit("change", {
          eventsQueue: [
            {
              filePath,
              metadata,
              type: "change",
            },
          ],
          changes: {
            addedDirectories: new Set(),
            removedDirectories: new Set(),
            addedFiles: new Map(),
            modifiedFiles: new Map([[filePath, metadata]]),
            removedFiles: new Map(),
          },
          rootDir: process.cwd(),
        });`;

if (!fs.existsSync(targetFile)) {
  console.log("[fix-nativewind-metro] target file not found, skipping");
  process.exit(0);
}

const current = fs.readFileSync(targetFile, "utf8");

if (current.includes("modifiedFiles: new Map([[filePath, metadata]])")) {
  console.log("[fix-nativewind-metro] patch already applied");
  process.exit(0);
}

if (!current.includes(brokenSnippet)) {
  console.log("[fix-nativewind-metro] expected snippet not found, skipping");
  process.exit(0);
}

fs.writeFileSync(targetFile, current.replace(brokenSnippet, fixedSnippet));
console.log("[fix-nativewind-metro] patch applied");
