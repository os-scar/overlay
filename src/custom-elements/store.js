import { computed, reactive } from 'vue';

const settings = reactive({});
const store = reactive({ packages: {} });
window.__overlay_global_store = store;

const packageStoreID = ({ type, name }) => `${type}:${name}`;

export const updatePackageInfo = (packageID, part, data) => {
  const packagePointer = packageStoreID(packageID);

  if (!store.packages[packagePointer]) {
    store.packages[packagePointer] = {
      sources: {},
    };
  }

  if (part === 'info') {
    store.packages[packagePointer] = { ...store.packages[packagePointer], ...data };
    return;
  }
  store.packages[packagePointer].sources[part] = data;
};

export const updateSettings = (newSettings) => {
  Object.assign(settings, newSettings);
};

export const usePackageInfo = (type, name) =>
  computed(() => {
    const packageInfo = store.packages[packageStoreID({ type, name })];
    if (!packageInfo) return null;

    const filteredSources = Object.entries(packageInfo.sources).reduce((acc, [key, value]) => {
      if (settings[key] !== false && value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return { ...packageInfo, sources: filteredSources };
  });
