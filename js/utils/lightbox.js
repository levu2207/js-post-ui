function showModal(modalElement) {
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // check if this modal is registered or not
  if (Boolean(modalElement.dataset.registered)) return;

  // selector
  const imageSelector = document.querySelector(imgSelector);
  const prevButton = document.querySelector(prevSelector);
  const nextButton = document.querySelector(nextSelector);

  if (!imageSelector || !prevButton || !nextButton) return;

  // lightbox vars
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imageSelector.src = imgList[index].src;
  }

  // handle click for all image --> event delegation
  // image click --> find all img with the same album/gallery
  // determine index of selector img
  // show modal with selector img
  // handle prev/next click

  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    // img with data-album
    imgList = document.querySelectorAll('img[data-album="Javascript"]');

    currentIndex = [...imgList].findIndex((x) => x === target);

    console.log({ target, currentIndex, imgList });
    // show img at index
    showImageAtIndex(currentIndex);
    // show modal
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    // show prev img of current album
    currentIndex = (currentIndex - 1 + imgList.length) % 3;
    showImageAtIndex(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    // show next img of current album
    currentIndex = (currentIndex + 1) % 3;
    showImageAtIndex(currentIndex);
  });

  // mark this modal is alredy registered
  modalElement.dataset.registered = 'true';
}
