export default function addPopover(data) {
  const element = document.createElement('div');
  element.classList.add('popover');
  element.innerHTML = `
  <h3 class="popover__header">${data.header}</h3>
  <div class="popover__body">${data.body}</div>
  `;

  return element;
}
