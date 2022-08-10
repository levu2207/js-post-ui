import debounce from 'lodash.debounce';

// pure function - dump function
export function initSearch({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId);
  if (!searchInput) return;

  // set default values from query params
  // title_like
  if (defaultParams && defaultParams.get('title_like')) {
    searchInput.value = defaultParams.get('title_like');
  }

  // create debounce function
  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500);
  // trigger search input
  searchInput.addEventListener('input', debounceSearch);
}
