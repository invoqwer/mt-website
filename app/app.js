import './styles/main.scss';

const icons = document.getElementsByClassName('fa-icon');

const linkEntries = document.querySelectorAll(
    '.link-description > .link-entry');
// log(linkEntries);
for (let i = 0; i < linkEntries.length; i++) {
  linkEntries[i].addEventListener('mouseover', () => {
    icons.item(i).classList.add('hover');
  });
  linkEntries[i].addEventListener('mouseout', () => {
    icons.item(i).classList.remove('hover');
  });
}

// parallax
const container = document.querySelector('.container');
const background = document.querySelector('.background');

container.addEventListener('mousemove', (e) => {
  const clientX = e.clientX;
  const innerWidth = window.innerWidth;

  // Calculate mouse position as percentage from center
  const xPercent = (clientX - innerWidth / 2) / (innerWidth / 2);

  // Move background in opposite direction of mouse
  // Multiply to control movement amount
  const xMove = -xPercent * 40;

  background.style.transform = `translateX(${xMove}px)`;
});
