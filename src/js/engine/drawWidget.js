export default function drawWidget() {
  const element = document.createElement('div');
  element.classList.add('wrapper');
  element.innerHTML = `
  <div class="container">
    <h1 class="container__title">POPOVER SAMPLE</h1>
    
    <div class="bd-example">
      <button type="button" class="btn btn-red" id="toggler">Click to toggle popover</button>
    </div>

  </div>`;

  document.body.append(element);
}
