<template>
  <Teleport to="body" append-to="self">
    <div
      class="overlay-indicator__tooltip"
      v-show="isOpen"
      @mouseenter="overTooltip = true"
      @mouseleave="overTooltip = false"
      ref="overlayTooltip"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script>
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
      overIndicator: false,
    };
  },
  watch: {
    overTooltip() {
      this.shouldCloseTooltip();
    },
    overIndicator() {
      this.shouldCloseTooltip();
    },
  },
  methods: {
    changeIsOpen(val) {
      this.$emit('update:modelValue', val);
    },
    shouldCloseTooltip() {
      setTimeout(() => {
        if (!this.overTooltip && !this.overIndicator) {
          this.changeIsOpen(false);
        }
      }, 300);
    },
  },
};
</script>

<style lang="scss"></style>
