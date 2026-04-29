function normalizeSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/['-]/g, "") // apostrophes / tirets
    .trim();
}

export default normalizeSearch;
