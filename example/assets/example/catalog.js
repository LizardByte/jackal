const toolbar = document.querySelector('[data-catalog-toolbar]');
const search = toolbar.querySelector('[data-catalog-search]');
const status = toolbar.querySelector('[data-catalog-status]');
const rows = [...document.querySelectorAll('[data-catalog-row]')];

function updateCatalog() {
  const query = search.value.trim().toLowerCase();
  let matches = 0;
  for (const row of rows) {
    row.hidden = !row.textContent.toLowerCase().includes(query);
    if (!row.hidden) matches += 1;
  }
  status.textContent = matches === 1 ? '1 result' : `${matches} results`;
}

search.addEventListener('input', updateCatalog);
updateCatalog();
toolbar.hidden = false;
