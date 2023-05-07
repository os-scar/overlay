<template>
  <Tooltip v-model="tooltipOpen">
    <template #activator>
      <div class="overlay-indicator__wrapper" :class="{ 'overlay-indicator__wrapper--issues': issues }">
        <div class="overlay-indicator__wrapper__icon">{{ issues }}</div>
        <div class="overlay-indicator__wrapper__text">
          <slot></slot>
        </div>
      </div>
    </template>

    <PackageReport :package-name="packageName" :package-type="packageType" />
  </Tooltip>
</template>

<script>
import { defineComponent } from 'vue';
import Tooltip from './Tooltip.vue';
import PackageReport from './PackageReport.vue';
import { usePackageInfo } from './store';

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export default defineComponent({
  name: 'overlay-indicator',
  components: {
    Tooltip,
    PackageReport,
  },
  props: {
    packageType: {
      type: String,
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const packageInfo = usePackageInfo(props.packageType, props.packageName);
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
    sources() {
      if (!this.packageInfo?.sources) return [];

      return Object.entries(this.packageInfo.sources).map(([sourceId, source]) => ({ ...source, id: sourceId }));
    },
    issues() {
      if (!this.sources) {
        return 0;
      }

      const sources = Object.values(this.sources)
        .filter((s) => s)
        .map(({ issues }) => issues);

      return sum(sources) || 0;
    },
  },
});
</script>

<style lang="scss">
// todo move font loading to somewhere global
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

$font-family: 'Roboto', sans-serif;
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
$color-light-gray: #f6f6f6;

$color-border: #e9e9e9;
$indicator-height: 18px;

$tooltip-width: 300px;

@mixin defuse-links($color: $color-black, $text-decoration: none) {
  text-decoration: $text-decoration;
  color: $color;

  &:active,
  &:visited,
  &:link,
  &:hover {
    color: $color;
  }
}

.overlay-indicator {
  div {
    box-sizing: border-box;
  }

  &__wrapper {
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
  }
}
</style>
