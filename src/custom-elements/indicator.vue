<template>
  <div class="overlay-indicator" :class="{ 'overlay-indicator--issues': package.issues ?? length }">
    <div class="overlay-indicator__icon">{{ package.issues }}</div>
    <div class="overlay-indicator__text">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'overlay-indicator',
  props: {
    overlayIndicatorPackageType: {
      type: String,
    },
    overlayIndicatorPackageName: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    store() {
      return window.__overlay_global_store || {};
    },
    packageId() {
      return `${this.overlayIndicatorPackageType}/${this.overlayIndicatorPackageName}`;
    },
    package() {
      return this.store.packages?.[this.packageId] || {};
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
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

$indicator-height: 24px;

.overlay-indicator {
  display: inline-flex;
  flex-direction: row;
  height: $indicator-height;
  overflow: hidden;
  border-radius: 4px;
  align-items: center;
  box-shadow: 0 0 0 1px $color-black;

  $class-name: &;

  &#{$class-name}--issues {
    box-shadow: 0 0 0 1px $color-red;

    #{$class-name}__icon {
      background: $color-red;
      color: $color-white;
    }
  }

  $icon-size: 24px;

  &__icon {
    width: $icon-size;
    height: $icon-size;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__text {
    padding: $padding-l1;
  }

  &__tooltip {
    padding: 20px;
    background: #eee;
  }
}
</style>
