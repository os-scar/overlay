<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <div>Show Snyk <input type="checkbox" v-model="showSnyk" /></div>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
export default defineComponent({
  components: { HelloWorld },
  data() {
    return {
      showSnyk: true,
    };
  },
  mounted() {
    chrome.storage.local.get('showSnyk').then(({ showSnyk }) => (this.showSnyk = showSnyk));
  },
  watch: {
    showSnyk: {
      handler(showSnyk) {
        chrome.storage.local.set({ showSnyk });
      },
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
