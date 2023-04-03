import { computed, reactive } from 'vue';

const settings = reactive({});
const store = reactive({ packages: {} });
window.__overlay_global_store = store;

// TODO: the key of a package should be a string instead of nested object.
export const updatePackageInfo = ({ type, name }, part, data) => {
  if (!store.packages[type]) {
    store.packages[type] = {};
  }
  if (!store.packages[type][name]) {
    store.packages[type][name] = {
      sources: {},
    };
  }

  if (part === 'info') {
    store.packages[type][name] = { ...store.packages[type][name], ...data };
    return;
  }
  store.packages[type][name].sources[part] = data;
};

export const updateSettings = (newSettings) => {
  Object.assign(settings, newSettings);
};

export const usePackageInfo = (type, name) =>
  computed(() => {
    const packageInfo = store.packages[type]?.[name];
    if (!packageInfo) return null;

    const filteredSources = Object.entries(packageInfo.sources).reduce((acc, [key, value]) => {
      if (settings[key] !== false && value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return { ...packageInfo, sources: filteredSources };
  });
