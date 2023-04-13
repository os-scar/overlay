<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <div v-for="(_, key) in advisories">Show {{ key }} <input type="checkbox" v-model="advisories[key]" /></div>
  </main>
</template>

<script>
import { defineComponent, toRaw } from 'vue';
import * as storage from '../../storage';
import HelloWorld from './components/HelloWorld.vue';
import { sendEventSettingsChanged } from './popup-events';

export default defineComponent({
  components: { HelloWorld },
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

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
