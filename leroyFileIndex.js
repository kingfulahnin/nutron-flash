/**
 * 🛠 LEROY FILE INDEXER v2.0
 * Scans a local directory for Nutron project files and builds a JSON ledger
 * Adds authorship, top file report, and status summary for Conductor #7
 * Run with: node leroyFileIndex.js
 */

const fs = require('fs');
const path = require('path');

// Config
const PROJECT_DIR = './'; // change if needed
const OUTPUT_FILE = 'leroy_file_index.json';
const DEFAULT_AUTHOR = 'Conductor #7';
const DEFAULT_CONVO = 'MothershipSync';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory
      ? walkDir(dirPath, callback)
      : callback(path.join(dir, f));
  });
}

function buildIndex(basePath, author = DEFAULT_AUTHOR, convo = DEFAULT_CONVO) {
  const fileList = [];
  walkDir(basePath, function(filePath) {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(basePath, filePath);

    if (relativePath === OUTPUT_FILE) return; // Skip self

    fileList.push({
      file: relativePath,
      size: stats.size,
      type: ext,
      authoredBy: author,
      conversationTag: convo,
      lastModified: stats.mtime.toISOString()
    });
  });

  return {
    lastScanBy: author,
    mergeEpoch: new Date().toISOString(),
    files: fileList
  };
}

function saveIndex(index) {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf8');
}

function reportSummary(indexObj) {
  const index = indexObj.files;
  const totalFiles = index.length;
  const totalSize = index.reduce((acc, file) => acc + file.size, 0);
  const sortedBySize = [...index].sort((a, b) => b.size - a.size).slice(0, 5);

  console.log('\n🧠 LEROY STATUS REPORT');
  console.log(`> Total Files Indexed: ${totalFiles}`);
  console.log(`> Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log('> Top 5 Largest Files:');
  sortedBySize.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f.file} — ${(f.size / 1024).toFixed(2)} KB`);
  });
}

const index = buildIndex(PROJECT_DIR);
saveIndex(index);
reportSummary(index);

console.log(`\n✅ Leroy index saved to ${OUTPUT_FILE}`);
console.log(`🛰️ Leroy reporting complete. Awaiting new directive, Conductor #7.`);