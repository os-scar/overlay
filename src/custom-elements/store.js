import { reactive } from 'vue';

const store = reactive({ packages: {} });

export const updatePackageInfo = ({ type, name, ...info }) => {
  if (!store.packages[type]) {
    store.packages[type] = {};
  }
  store.packages[type][name] = info;
};

export default store;
