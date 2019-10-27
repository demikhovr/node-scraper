const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const clearFile = (path) => fs.writeFileSync(path, '[]', () => {
  log(`${path} cleared.`);
});

const updateFile = (path, ...newData) => {
  const content = fs.readFileSync(path);
  const data = JSON.parse(content);
  fs.writeFileSync(path, JSON.stringify([...data, ...newData], null, 4));
};

const getCSVWriter = (fields, path) => createObjectCsvWriter({
  path,
  header: Object.values(fields).map((it) => ({ id: it, title: it })),
});

const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

module.exports = {
  clearFile,
  updateFile,
  getCSVWriter,
  delay,
};
