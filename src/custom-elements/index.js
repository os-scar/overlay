import {defineCustomElement, reactive } from 'vue';
import indicator from './indicator.vue';
const overlayGlobalStore = reactive({ packages: {} })

let indicatorCustomElement = defineCustomElement(indicator);
customElements.define('overlay-indicator', indicatorCustomElement);
window.__overlay_global_store = overlayGlobalStore
