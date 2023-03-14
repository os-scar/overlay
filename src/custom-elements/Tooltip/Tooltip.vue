<template>
  <div class="overlay-tooltip">
    <div
      @mouseenter="
        initTooltipPosition();
        overActivator = true;
        changeIsOpen(true);
      "
      @mouseleave="overActivator = false"
      ref="activator"
    >
      <slot name="activator"></slot>
    </div>
    <div class="tooltip">
      <Teleport to="body" append-to="self">
        <div
          class="overlay-tooltip__tooltip"
          v-show="modelValue"
          @mouseenter="overTooltip = true"
          @mouseleave="overTooltip = false"
          ref="overlayTooltip"
        >
          <slot />
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script>
import { initTooltipPosition } from './tooltip';

export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      overTooltip: false,
      overActivator: false,
    };
  },
  watch: {
    overTooltip() {
      this.shouldCloseTooltip();
    },
    overActivator() {
      this.shouldCloseTooltip();
    },
  },
  methods: {
    changeIsOpen(val) {
      this.$emit('update:modelValue', val);
    },
    shouldCloseTooltip() {
      setTimeout(() => {
        if (!this.overTooltip && !this.overActivator) {
          this.changeIsOpen(false);
        }
      }, 300);
    },
    initTooltipPosition() {
      initTooltipPosition(this.$refs.activator, this.$refs.overlayTooltip);
    },
  },
  mounted() {
    this.initTooltipPosition();
  },
};
</script>

<style lang="scss">
.overlay-tooltip {
  position: relative;
  display: inline-block;

  &__tooltip {
    position: absolute;
    padding: 20px;
    z-index: 1000;
    background: #e12d33;
    width: 260px;
    height: 200px;
    overflow: scroll;
  }
}
</style>
