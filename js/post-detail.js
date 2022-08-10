import postApi from './api/postApi';
import { registerLightbox, setTextContent } from './utils';
import dayjs from 'dayjs';

function renderPostDetail(post) {
  if (!post) return;
  // render title
  // render author
  // render description
  // render timeSpan
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' [ at ] HH:mm:ss  -  DD/MM/YYYY')
  );

  // render hero image
  const heroImage = document.getElementById('postHeroImage');
  if (!heroImage) return;
  heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

  // if photo error
  heroImage.addEventListener('error', () => {
    console.log('failed to load image');
    heroImage.style.backgroundImage = `url(
      "https://placehold.jp/e3e3e3/9c9c9c/1368x400.png?text=1368x400")`;
  });

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.Id}`;
    editPageLink.textContent = 'Edit Post';
  }
}

(async () => {
  registerLightbox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });

  registerLightbox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });
  // get post id from url
  // fetch post detail API object
  // render post detail
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const postId = queryParams.get('id');
    if (!postId) return;

    const post = await postApi.getById(postId);

    renderPostDetail(post);
  } catch (err) {
    console.log('failed to fetch post detail', error);
  }
})();
