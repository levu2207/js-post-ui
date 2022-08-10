import postApi from './api/postApi';
import { initPagination, initSearch, renderPostList, renderPagination } from './utils';

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // reset page when search is done
  if (filterName === 'title_like') url.searchParams.set('_page', 1);

  // fetch API
  // re-render post list
  const { data, pagination } = await postApi.getAll(url.searchParams);
  renderPostList('postsList', data);
  renderPagination('pagination', pagination);
}

(async () => {
  try {
    const url = new URL(window.location);

    // update search params if needed
    // set default pagination (_page, _limit) on URL

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);
    if (url.searchParams.get('title_like')) url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    const queryParams = url.searchParams;

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    const { data, pagination } = await postApi.getAll(queryParams);
    // render post list
    renderPostList('postsList', data);

    // render pagination
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
