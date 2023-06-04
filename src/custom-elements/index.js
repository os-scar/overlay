import '@webcomponents/custom-elements';
import { defineCustomElement } from 'vue';
import { OVERLAY_INDICATOR } from '../global';
import Indicator from './Indicator.vue';
import PackageReport from './PackageReport.vue';
import { initEventListenersAndStore } from './webapp-events';

initEventListenersAndStore();

// Workaround for https://github.com/vuejs/core/issues/4662
const modules = import.meta.glob('./**/*.vue');
Promise.all(Object.values(modules).map((module) => module())).then((modules) => {
  const styles = modules.map((module) => module.default.styles);
  Indicator.styles = [styles.flat().join('')];

  const indicatorCustomElement = defineCustomElement(Indicator);
  customElements.define(OVERLAY_INDICATOR, indicatorCustomElement);
  const packageReportCustomElement = defineCustomElement(PackageReport);
  // TODO: use 'overlay-package-report' from global.js
  customElements.define('overlay-package-report', packageReportCustomElement);

  console.log('Custom element defined');
});
