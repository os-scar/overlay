import {defineCustomElement} from 'vue';
import indicator from './indicator.vue';

let indicatorCustomElement = defineCustomElement(indicator);
customElements.define('overlay-indicator', indicatorCustomElement);
