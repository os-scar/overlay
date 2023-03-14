import '@webcomponents/custom-elements';
import { defineCustomElement, reactive } from 'vue';
import indicator from './Indicator.vue';

let indicatorCustomElement = defineCustomElement(indicator);
customElements.define('overlay-indicator', indicatorCustomElement);
const overlayGlobalStore = reactive({ packages: {} });
window.__overlay_global_store = overlayGlobalStore;
