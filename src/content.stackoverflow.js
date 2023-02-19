import { mountContentScript } from './content';
import { findRanges } from './content/stackoverflow/finder';
import { addIndicator } from './content/stackoverflow/indicator';

const mountWebComponentByInnerHTML = () => {
  const div = document.createElement('div');
  div.innerHTML = `<overlay-indicator id="baruch" overlay-indicator-package-type="npm" overlay-indicator-package-name="node-sass">my-package-name</overlay-indicator>`;
  const indicator = div.firstElementChild;
  document.body.insertBefore(indicator, document.body.firstChild);
};

const mountWebComponentByCreateElement = () => {
  const indicator = document.createElement('overlay-indicator');
  indicator.setAttribute('overlay-indicator-package-type', 'npm');
  indicator.setAttribute('overlay-indicator-package-name', 'react');
  // indicator.innerHTML = 'another-package-name';
  indicator.appendChild(document.createTextNode('another-package-name'));
  document.body.insertBefore(indicator, document.body.firstChild);
};

mountContentScript(async () => {
  mountWebComponentByInnerHTML();
  mountWebComponentByCreateElement();

  const ranges = findRanges(document.body);
  console.debug({ ranges });

  ranges.map(addIndicator);
});
