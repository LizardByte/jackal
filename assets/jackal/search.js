(() => {
  const form = document.querySelector('.jackal-search');
  const input = form.querySelector('input');
  const message = document.getElementById('jackal-search-status');
  const results = document.getElementById('jackal-search-results');
  let entries;

  async function search(query) {
    results.replaceChildren();
    const terms = query.toLowerCase().trim().split(/\s+/u).filter(Boolean);
    if (!terms.length) {
      message.value = 'Enter a search term.';
      return;
    }

    message.value = 'Searching…';
    try {
      entries ??= fetch(form.dataset.searchIndex).then(response => {
        if (!response.ok) throw new Error('Search index unavailable.');
        return response.json();
      });
      const index = await entries;
      if (query !== input.value) return;
      let count = 0;
      for (const entry of index) {
        const text = [entry.title, entry.description, entry.text, ...(entry.tags ?? [])].join(' ').toLowerCase();
        if (!terms.every(term => text.includes(term))) continue;

        const url = new URL(entry.url, location.href);
        if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) continue;
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = url.href;
        link.textContent = entry.title;
        item.append(link);
        if (entry.description) {
          const description = document.createElement('p');
          description.textContent = entry.description;
          item.append(description);
        }
        results.append(item);
        count += 1;
        if (count === 50) break;
      }
      const unit = count === 1 ? 'result' : 'results';
      message.value = count ? `${count} ${unit}` : 'No results found.';
    } catch {
      entries = undefined;
      message.value = 'Site search is temporarily unavailable.';
    }
  }

  const params = new URLSearchParams(location.search);
  input.value = params.get('q') ?? '';
  if (input.value) void search(input.value);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const url = new URL(location.href);
    url.searchParams.set('q', input.value);
    history.replaceState(null, '', url);
    void search(input.value);
  });
})();
