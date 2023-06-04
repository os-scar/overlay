import { SECOND } from '../global';
import { mountContentScript } from './content';
import { addIndicatorToFindingsInElement } from './create-element';

mountContentScript(async () => {
  setInterval(() => addIndicatorToFindingsInElement(document.querySelector('main')), 5 * SECOND);
});
