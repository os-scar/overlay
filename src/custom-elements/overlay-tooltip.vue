<template>
  <div class="overlay-indicator__tooltip">
    <div class="overlay-indicator__tooltip__header">
      <div class="overlay-indicator__tooltip__header__metadata">
        <div class="overlay-indicator__tooltip__header__metadata__package_name">{{ package.name }}</div>
        <component :is="`${package.type}_logo`" class="overlay-indicator__tooltip__header__metadata__package_type"></component>
        <div class="overlay-indicator__tooltip__header__metadata__package_stars">{{ shortenStarsCount(package.stars) }}</div>
      </div>
      <div class="overlay-indicator__tooltip__header__expand"></div>
    </div>
    <div class="overlay-indicator__tooltip__item" v-for="source in package.sources">
      <div class="overlay-indicator__tooltip__item__openssf" v-if="source.name === 'scorecards' && !source.error">
        <div class="overlay-indicator__tooltip__item__openssf__metadata">
          <div class="overlay-indicator__tooltip__item__openssf__metadata__logo"></div>
          <div class="overlay-indicator__tooltip__item__openssf__metadata__name">OpenSSF</div>
        </div>
        <div class="overlay-indicator__tooltip__item__openssf__score">
          <div class="overlay-indicator__tooltip__item__openssf__score__value">{{ source.data.score }} / 10</div>
          <div class="overlay-indicator__tooltip__item__openssf__score__name">Scorecard</div>
        </div>
      </div>
      <div class="overlay-indicator__tooltip__item__openbase" v-if="source.name === 'openbase' && !source.error">
        <div class="overlay-indicator__toltip__item__openbase__metadata" :style="tooltipVendorMetadataStyle">
          <div class="overlay-indicator__tooltip__item__openbase__metadata__logo"></div>
          <div class="overlay-indicator__tooltip__item__openbase__metadata__name">OpenBase</div>
        </div>
        <div class="overlay-indicator__tooltip__item__openbase__score">
          <div class="overlay-indicator__tooltip__item__openbase__score__value">{{ source.data['userRating'] }} / 5</div>
          <div class="overlay-indicator__tooltip__item__openbase__score__name">user rating</div>
        </div>
      </div>
      <div class="overlay-indicator__tooltip__item__debricked" v-if="source.name === 'debricked' && !source.error">
        <div class="overlay-indicator__tooltip__item__debricked__metadata">
          <div class="overlay-indicator__tooltip__item__debricked__metadata__logo"></div>
          <div class="overlay-indicator__tooltip__item__debricked__metadata__name">Debricked</div>
        </div>
        <div class="overlay-indicator__tooltip__item__debricked__score">{{ source.score }}</div>
      </div>
      <div class="overlay-indicator__tooltip__item__socket" v-if="source.name === 'socket.dev' && !source.error">
        <div class="overlay-indicator__tooltip__item__socket__metadata">
          <div class="overlay-indicator__tooltip__item__socket__metadata__logo"></div>
          <div class="overlay-indicator__tooltip__item__socket__metadata__name">Socket</div>
        </div>
        <div class="overlay-indicator__tooltip__item__socket__score">
          <div class="overlay-indicator__tooltip__item__socket__score__value">{{ source.data['supplyChain'] }} / 100</div>
          <div class="overlay-indicator__tooltip__item__socket__score__name">Supply Chain</div>
        </div>
      </div>
      <div class="overlay-indicator__tooltip__item__checkmarx" v-if="source.name === 'checkmarx' && !source.error">
        <div class="overlay-indicator__tooltip__item__checkmarx__metadata">
          <div class="overlay-indicator__tooltip__item__checkmarx__metadata__logo"></div>
          <div class="overlay-indicator__tooltip__item__checkmarx__metadata__name">Checkmarx</div>
        </div>
        <div class="overlay-indicator__tooltip__item__checkmarx__score">{{ source.score }}</div>
      </div>
      <div class="overlay-indicator__tooltip__item__snyk" v-if="source.name === 'snyk' && !source.error">
        <div class="overlay-indicator__tooltip__item__snyk__metadata">
          <div class="overlay-indicator__tooltip__item__snyk__metadata__logo"></div>
          <div class="overlay-indicator__tooltip__item__snyk__metadata__name">Snyk</div>
        </div>
        <div class="overlay-indicator__tooltip__item__snyk__score">{{ source.score }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'overlay-tooltip',
  props: {
    overlayindicatorpackagetype: {
      type: String,
    },
    overlayindicatorpackagename: {
      type: String,
    },
  },
  computed: {
    store() {
      return window.__overlay_global_store || {};
    },
    packageId() {
      return `${this.overlayindicatorpackagetype}/${this.overlayindicatorpackagename}`;
    },
    package() {
      return this.store.packages[this.packageId] || {};
    },
  },
  methods: {},
};
</script>

<style lang="scss">
$font-family: 'Lexend', sans-serif;
$font-size-title: 12px;
$font-size-score-value: 10px;
$font-size-score-name: 8px;

$padding-l1: 4px;
$padding-l2: 8px;
$padding: 8px;
$border-radius: 6px;

$color-black: #000;
$color-red: #ff0000;
$color-green: #14ce00;
$color-white: #fff;

div {
  box-sizing: border-box;
}

:global(.overlay-indicator__tooltip),
.overlay-indicator__tooltip {
  position: absolute;
  padding: 20px;
  z-index: 1000;
  background: #e12d33;
  width: 260px;
  height: 200px;
  overflow: scroll;
}
</style>
