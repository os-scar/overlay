<template>
  <main>
    <div v-for="(_, key) in advisories">Show {{ key }} <input type="checkbox" v-model="advisories[key]" /></div>
  </main>
</template>

<script>
import { defineComponent, toRaw } from 'vue';
import * as storage from '../storage';
import { sendEventSettingsChanged } from './popup-events';

export default defineComponent({
  data() {
    return {
      advisories: {},
    };
  },
  mounted() {
    storage.getAllAdvisoriesSettings().then((settings) => (this.advisories = settings));
  },
  watch: {
    advisories: {
      handler(advisories) {
        storage.setAllAdvisoriesSettings(toRaw(advisories)).then(sendEventSettingsChanged);
      },
      deep: true,
      immediate: false,
    },
  },
});
</script>

<style scoped></style>
