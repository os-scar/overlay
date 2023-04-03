<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <div>Show Snyk <input type="checkbox" v-model="snyk" /></div>
    <div>Show Socket <input type="checkbox" v-model="socket" /></div>
  </main>
</template>

<script>
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { sendEventSettingsChanged } from './popup-events';

export default defineComponent({
  components: { HelloWorld },
  data() {
    return {
      snyk: true,
      socket: true,
    };
  },
  mounted() {
    // TODO: manage the storage in one place (like the store)
    chrome.storage.local.get('snyk').then(({ snyk }) => (this.snyk = snyk));
    chrome.storage.local.get('socket').then(({ socket }) => (this.socket = socket));
  },
  watch: {
    snyk: {
      handler(snyk) {
        chrome.storage.local
          .set({ snyk })
          .then(() => chrome.storage.local.get())
          .then(sendEventSettingsChanged);
      },
      immediate: false,
    },
    socket: {
      handler(socket) {
        chrome.storage.local
          .set({ socket })
          .then(() => chrome.storage.local.get())
          .then(sendEventSettingsChanged);
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
