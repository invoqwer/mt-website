// import webpack assets

// sass
import './styles/main.scss';

// const log = console.log;
const icons = document.getElementsByClassName('fa-icon');
// log(icons)
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
