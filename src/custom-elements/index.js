import '@webcomponents/custom-elements';
import { defineCustomElement } from 'vue';
import indicator from './indicator.vue';
import { initEventListenersAndStore } from './webapp-events';

initEventListenersAndStore();

let indicatorCustomElement = defineCustomElement(indicator);
customElements.define('overlay-indicator', indicatorCustomElement);
