import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

// to use fromNow function
dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;

  // find and clone tamplate
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);

  if (!liElement) return;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 110));
  setTextContent(liElement, '[data-id="author"]', post.author);

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
  // go to post detail when click on div.post-item
  const divElement = liElement.firstElementChild;
  divElement.addEventListener('click', (event) => {
    // S2: if event is triggered from menu add/edit --> ignore
    const menu = liElement.querySelector('[data-id="menu"]');

    if (menu && menu.contains(event.target)) return;

    window.location.assign(`/post-detail.html?id=${post.id}`);
  });

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', () => {
      // S1: e.stopPropagation(); // not recommend if web have tracking script

      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }

  return liElement;
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // reset post list element
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
