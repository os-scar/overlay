<template>
  <Tooltip v-model="tooltipOpen">
    <template #activator>
      <div class="overlay-indicator" :class="{ 'overlay-indicator--issues': issues }">
        <div class="overlay-indicator__icon">{{ issues }}</div>
        <div class="overlay-indicator__text">
          <slot></slot>
        </div>
      </div>
    </template>

    <div>
      <!-- test to open url in new page svg-->
      <a target="_blank" :href="`https://www.npmjs.com/package/${packageInfo?.name}`">{{ packageInfo?.name }}</a>

      <!-- test to load svg-->
      <component :is="`${packageInfo?.type}_logo`"></component>

      <!-- just show all package json at the moment-->
      <div>{{ packageInfo }}</div>
    </div>
  </Tooltip>
</template>

<script>
import { defineComponent } from 'vue';
import Tooltip from './Tooltip.vue';
import npm_logo from './assets/npm_logo.svg?component';
import { usePackageInfo } from './store';

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export default defineComponent({
  name: 'overlay-indicator',
  props: {
    overlayIndicatorPackageType: {
      type: String,
      required: true,
    },
    overlayIndicatorPackageName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const packageInfo = usePackageInfo(props.overlayIndicatorPackageType, props.overlayIndicatorPackageName);
    return { packageInfo };
  },
  data() {
    return {
      tooltipOpen: false,
      overTooltip: false,
      overIndicator: false,
    };
  },
  computed: {
    issues() {
      if (!this.packageInfo?.sources) return 0;

      const sources = Object.values(this.packageInfo.sources).filter((s) => s);
      return sum(sources.map(({ issues }) => issues));
    },
  },
  components: {
    npm_logo,
    Tooltip,
  },
});
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

$indicator-height: 18px;

.overlay-indicator {
  display: inline-block;
  user-select: none;
  position: relative;
  height: $indicator-height;
  top: $padding-l1;
  overflow: hidden;
  border-radius: 4px;
  align-items: center;
  z-index: 10;
  box-shadow: 0 0 0 1px $color-black;
  $class-name: &;

  &#{$class-name}--issues {
    box-shadow: 0 0 0 1px $color-red;

    #{$class-name}__icon {
      background: $color-red;
      color: $color-white;
    }
  }

  $icon-size: $indicator-height;

  &__icon {
    width: $icon-size;
    height: $icon-size;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  }

  &__text {
    padding: 0 $padding-l1;
    margin-left: $icon-size;
    display: inline-block;
    user-select: text;
  }

  div {
    box-sizing: border-box;
  }
}
</style>
