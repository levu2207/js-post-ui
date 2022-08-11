export function setTextContent(parent, selector, text) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) return (element.textContent = text);
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(form, selector, value) {
  if (!form) return;

  const field = form.querySelector(selector);
  if (field) return (field.value = value);
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;

  const image = parent.querySelector(selector);
  if (image) image.style.backgroundImage = `url("${imageUrl}")`;
}
