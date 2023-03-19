import { reactive } from 'vue';

const store = reactive({ packages: {} });
window.__overlay_global_store = store;

export const updatePackageInfo = ({ type, name }, part, info) => {
  if (!store.packages[type]) {
    store.packages[type] = {};
  }
  if (!store.packages[type][name]) {
    store.packages[type][name] = {
      sources: {},
    };
  }

  if (part === 'info') {
    store.packages[type][name] = { ...store.packages[type][name], ...info };
    return;
  }
  store.packages[type][name].sources[part] = info;
};

export default store;
