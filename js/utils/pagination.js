export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next buttons
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // set current active page

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      if (page > 1) onChange?.(page - 1);
    });
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = ulPagination.dataset.totalPages;
      if (page < totalPages) onChange?.(page + 1);
    });
  }
}

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;
  // calculate totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check enable/disable prev/next link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}
