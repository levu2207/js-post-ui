import axiosClient from './api/axiosClient';
import postApi from './api/postApi';

function createPostElement(post) {
  if (!post) return;

  // find and clone tamplate
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  console.log(liElement);
  if (!liElement) return;

  // update title, description, author, thumnail
  const titleElement = liElement.querySelector('[data-id="title"]');
  if (titleElement) titleElement.textContent = post.title;

  const descriptionElement = liElement.querySelector('[data-id="description"]');
  if (descriptionElement) descriptionElement.textContent = post.description;

  const authorElement = liElement.querySelector('[data-id="author"]');
  if (authorElement) authorElement.textContent = post.author;

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) thumbnailElement.src = post.imageUrl;

  // attach events
  return liElement;
}

function renderPostList(postList) {
  console.log({ postList });
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElement = document.getElementById('postsList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };
    // const response = await axiosClient.get('/posts');
    const { data, pagination } = await postApi.getAll(queryParams);
    // render post list
    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
