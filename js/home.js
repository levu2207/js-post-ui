import postApi from './api/postApi';
import { setTextContent, truncateText, getUlPagination } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// to use fromNow function
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  // find and clone tamplate
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);

  if (!liElement) return;

  // update title, description, author, thumnail
  // const titleElement = liElement.querySelector('[data-id="title"]');
  // if (titleElement) titleElement.textContent = post.title;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 110));
  setTextContent(liElement, '[data-id="author"]', post.author);

  // const descriptionElement = liElement.querySelector('[data-id="description"]');
  // if (descriptionElement) descriptionElement.textContent = post.description;

  // const authorElement = liElement.querySelector('[data-id="author"]');
  // if (authorElement) authorElement.textContent = post.author;
  // calculate timespan
  const timeSpan = dayjs(post.updatedAt).fromNow();
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${timeSpan}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://placehold.jp/e3e3e3/9c9c9c/600x480.png?text=thumbnail';
    });
  }

  // attach events
  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  // reset post list element
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

async function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // fetch API
  // re-render post list
  const { data, pagination } = await postApi.getAll(url.searchParams);
  renderPostList(data);
  renderPagination(pagination);
}

function handlePrevClick(e) {
  e.preventDefault();

  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page);
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();

  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page);
  const totalPages = ulPagination.dataset.totalPages;
  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function initPagination() {
  // bind click event for prev/next buttons
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick);
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick);
  }
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination();
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

function initURL() {
  const url = new URL(window.location);

  // update search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
}

(async () => {
  try {
    initPagination();

    initURL();

    const queryParams = new URLSearchParams(window.location.search);
    // set default query params if not exited

    // const response = await axiosClient.get('/posts');
    const { data, pagination } = await postApi.getAll(queryParams);
    // render post list
    renderPostList(data);

    // render pagination
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
