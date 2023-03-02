<template>
  <div
    class="overlay-indicator"
    :class="{ 'overlay-indicator--issues': package.issues ?? length }"
    @mouseenter="
      initTooltipPosition();
      this.overIndicator = true;
      tooltipOpen = true;
    "
    @mouseleave="
      this.overIndicator = false;
      shouldCloseTooltip();
    "
    ref="overlay"
  >
    <div class="overlay-indicator__icon">{{ package.issues }}</div>
    <div class="overlay-indicator__text">
      <slot></slot>
    </div>
    <teleport to="body" append-to="self">
      <div
        class="overlay-indicator__tooltip"
        v-show="tooltipOpen"
        @mouseenter="overTooltip = true"
        @mouseleave="
          overTooltip = false;
          shouldCloseTooltip();
        "
        ref="overlayTooltip"
      >
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
            <div class="overlay-indicator__toltip__item__openbase__metadata">
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
    </teleport>
  </div>
</template>

<script>
import npm_logo from './assets/npm_logo.svg?component';

const TOOLTIP_POSITION = {
  TOP_START: 'top_start',
  TOP_END: 'top_end',
  TOP: 'top',
  BOTTOM_START: 'bottom_start',
  BOTTOM_END: 'bottom_end',
  BOTTOM: 'bottom',
  LEFT_START: 'left_start',
  LEFT_END: 'left_end',
  LEFT: 'left',
  RIGHT_START: 'right_start',
  RIGHT_END: 'right_end',
  RIGHT: 'right',
};

export default {
  name: 'overlay-indicator',
  props: {
    overlayindicatorpackagetype: {
      type: String,
    },
    overlayindicatorpackagename: {
      type: String,
    },
  },
  data() {
    return {
      tooltipOpen: false,
      overTooltip: false,
      overIndicator: false,
    };
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
  methods: {
    initTooltipPosition() {
      let baseElement = this.$refs.overlay,
        tooltipElement = this.$refs.overlayTooltip,
        tooltipPosition = TOOLTIP_POSITION.BOTTOM;
      this.placeTooltip(baseElement, tooltipElement, tooltipPosition);
    },
    placeTooltip(baseElement, tooltipElement, tooltipPosition) {
      const baseRect = baseElement.getBoundingClientRect();
      const tooltipRect = tooltipElement.getBoundingClientRect() || {};
      const parent = baseElement.getRootNode().host || document;
      let targetPosition = this.getPosition(baseRect, tooltipRect, tooltipPosition);
      const parentRect = parent === document ? this.getDocumentBoundingRect() : parent.getBoundingClientRect();
      if (this.shouldFlip(targetPosition, tooltipRect, parentRect, tooltipPosition)) {
        tooltipPosition = this.getOppositePosition(tooltipPosition);
        targetPosition = this.getPosition(baseRect, tooltipRect, tooltipPosition);
      }
      tooltipElement.style.left = targetPosition.left + 'px';
      tooltipElement.style.top = targetPosition.top + 'px';
    },
    getPosition(baseRect, tooltipRect, tooltipPosition) {
      const basePadding = 4;
      tooltipRect.width = tooltipRect.width || 260;
      tooltipRect.height = tooltipRect.height || 200;
      let pageOffset = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      switch (tooltipPosition) {
        case TOOLTIP_POSITION.TOP_START:
          return {
            top: pageOffset + baseRect.top - basePadding - tooltipRect.height,
            left: baseRect.left,
          };
        case TOOLTIP_POSITION.TOP_END:
          return {
            top: pageOffset + baseRect.top - basePadding - tooltipRect.height,
            left: baseRect.left - baseRect.width - tooltipRect.width - basePadding,
          };
        case TOOLTIP_POSITION.TOP:
          return {
            top: pageOffset + baseRect.top - tooltipRect.height,
            left: baseRect.left + baseRect.width / 2 - tooltipRect.width / 2,
          };
        case TOOLTIP_POSITION.BOTTOM_START:
          return {
            top: pageOffset + baseRect.top + baseRect.height + basePadding,
            left: baseRect.left + basePadding,
          };
        case TOOLTIP_POSITION.BOTTOM_END:
          return {
            top: pageOffset + baseRect.top + baseRect.height + baseRect.height + basePadding,
            left: baseRect.left - baseRect.width - tooltipRect.width - basePadding,
          };
        case TOOLTIP_POSITION.BOTTOM:
          if (baseRect.left + baseRect.width / 2 - tooltipRect.width / 2 < 0) {
            return {
              top: pageOffset + baseRect.top + baseRect.height + basePadding,
              left: baseRect.left + baseRect.width / 2,
            };
          }
          return {
            top: pageOffset + baseRect.top + baseRect.height + basePadding,
            left: baseRect.left + baseRect.width / 2 - tooltipRect.width / 2,
          };
        case TOOLTIP_POSITION.LEFT_START:
          return {
            top: pageOffset + baseRect.top + basePadding,
            left: baseRect.left - tooltipRect.width - basePadding,
          };
        case TOOLTIP_POSITION.LEFT_END:
          return {
            top: pageOffset + baseRect.top - baseRect.height - tooltipRect.height - basePadding,
            left: baseRect.left - tooltipRect.width - basePadding,
          };
        case TOOLTIP_POSITION.LEFT:
          return {
            top: pageOffset + baseRect.top + baseRect.height / 2 - tooltipRect.height / 2,
            left: baseRect.left - tooltipRect.width - basePadding,
          };
        case TOOLTIP_POSITION.RIGHT_START:
          return {
            top: pageOffset + baseRect.top,
            left: baseRect.left + baseRect.width + basePadding,
          };
        case TOOLTIP_POSITION.RIGHT_END:
          return {
            top: pageOffset + baseRect.top - baseRect.height - tooltipRect.height - basePadding,
            left: baseRect.left + baseRect.width,
          };
        case TOOLTIP_POSITION.RIGHT:
          return {
            top: pageOffset + baseRect.top + baseRect.height / 2 - tooltipRect.height / 2,
            left: baseRect.left + baseRect.width + basePadding,
          };
        default:
          return {
            top: pageOffset + baseRect.top + baseRect.height + basePadding,
            left: baseRect.left + baseRect.width + basePadding,
          };
      }
    },
    getOppositePosition(position) {
      switch (position) {
        case TOOLTIP_POSITION.TOP_START:
          return TOOLTIP_POSITION.BOTTOM_START;
        case TOOLTIP_POSITION.TOP_END:
          return TOOLTIP_POSITION.BOTTOM_END;
        case TOOLTIP_POSITION.TOP:
          return TOOLTIP_POSITION.BOTTOM;
        case TOOLTIP_POSITION.BOTTOM_START:
          return TOOLTIP_POSITION.TOP_START;
        case TOOLTIP_POSITION.BOTTOM_END:
          return TOOLTIP_POSITION.TOP_END;
        case TOOLTIP_POSITION.BOTTOM:
          return TOOLTIP_POSITION.TOP;
        case TOOLTIP_POSITION.LEFT_START:
          return TOOLTIP_POSITION.RIGHT_START;
        case TOOLTIP_POSITION.LEFT_END:
          return TOOLTIP_POSITION.RIGHT_END;
        case TOOLTIP_POSITION.LEFT:
          return TOOLTIP_POSITION.RIGHT;
        case TOOLTIP_POSITION.RIGHT_START:
          return TOOLTIP_POSITION.LEFT_START;
        case TOOLTIP_POSITION.RIGHT_END:
          return TOOLTIP_POSITION.LEFT_END;
        case TOOLTIP_POSITION.RIGHT:
          return TOOLTIP_POSITION.LEFT;
        default:
          return TOOLTIP_POSITION.BOTTOM;
      }
    },
    getDocumentBoundingRect() {
      const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      return {
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        width: width,
        height: height,
      };
    },
    shouldFlip(targetPosition, tooltipRect, boundaryRect, position) {
      tooltipRect.width = tooltipRect.width || 260;
      tooltipRect.height = tooltipRect.height || 440;
      let pageOffset = window.scrollY || document.documentElement.scrollTop;
      let pageBoundaryBottom = pageOffset + window.innerHeight;
      switch (position) {
        case TOOLTIP_POSITION.TOP_START:
        case TOOLTIP_POSITION.TOP_END:
        case TOOLTIP_POSITION.TOP:
          return pageOffset + targetPosition.top > pageOffset.top;
        case TOOLTIP_POSITION.BOTTOM_START:
        case TOOLTIP_POSITION.BOTTOM_END:
        case TOOLTIP_POSITION.BOTTOM:
          return pageBoundaryBottom < targetPosition.top + tooltipRect.height;
        case TOOLTIP_POSITION.LEFT_START:
        case TOOLTIP_POSITION.LEFT_END:
        case TOOLTIP_POSITION.LEFT:
          return targetPosition.left > boundaryRect.left;
        case TOOLTIP_POSITION.RIGHT_START:
        case TOOLTIP_POSITION.RIGHT_END:
        case TOOLTIP_POSITION.RIGHT:
          return targetPosition.left + tooltipRect.width < boundaryRect.right;
        default:
          return false;
      }
    },
    shouldCloseTooltip() {
      setTimeout(() => {
        if (!this.overTooltip && !this.overIndicator) {
          this.tooltipOpen = false;
        }
      }, 300);
    },
    shortenStarsCount(number) {
      if (number < 1e3) return number;
      if (number >= 1e3 && number < 1e6) return +(number / 1e3).toFixed(1) + 'K';
      if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + 'M';
      if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + 'B';
      if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T';
    },
  },
  mounted() {
    this.initTooltipPosition();
  },
  components: {
    npm_logo,
  },
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

$indicator-height: 24px;

.overlay-indicator {
  display: inline-flex;
  flex-direction: row;
  position: relative;
  height: $indicator-height;
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
    position: absolute;
    padding: 20px;
    z-index: 1000;
    background: #e12d33;
    width: 260px;
    height: 200px;
    overflow: scroll;
  }

  div {
    box-sizing: border-box;
  }
}
</style>
