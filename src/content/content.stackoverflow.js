import { mountContentScript } from './content';
import { addIndicatorToFindingsInElement } from './create-element';

const POST_SELECTOR = 'div.js-post-body';

mountContentScript(() => addIndicatorToFindingsInElement(document.body, POST_SELECTOR));
