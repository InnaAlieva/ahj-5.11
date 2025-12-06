import drawWidget from './drawWidget';
import addPopover from './addPopover';

export default class ShowPopover {
  constructor() {
    drawWidget();
    this.inputElement = document.querySelector('.btn');
  }

  init() {
    this.addInputListeners();
  }

  addInputListeners() {
    this.inputElement.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        this.togglePopover(event.target);
      },
      false
    );
  }

  togglePopover(target) {
    if (this.popover) {
      this.popover.remove();
      this.popover = '';
      return;
    }
    const popoverContent = {
      header: `Popover title`,
      body: `Popover was called from the element with type="${target.type}" and id="${target.id}"`,
    };
    this.popover = addPopover(popoverContent);
    target.offsetParent.appendChild(this.popover);

    this.popover.style.top = `${target.offsetTop - this.popover.offsetHeight - 15}px`;
    this.popover.style.left = `${
      target.offsetLeft + target.offsetWidth / 2 - this.popover.offsetWidth / 2
    }px`;
  }
}
