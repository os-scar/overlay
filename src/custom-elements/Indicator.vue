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

    <div class="overlay-indicator__tooltip" :data-testId="packageName">
      <div class="overlay-indicator__tooltip__header">
        <div class="overlay-indicator__tooltip__header__logo">
          <npm-logo v-if="packageType === 'npm'"></npm-logo>
          <python-logo v-if="packageType === 'pypi'"></python-logo>
        </div>

        <div class="overlay-indicator__tooltip__header__info">
          <div class="overlay-indicator__tooltip__header__info__package-name">
            <a :title="packageName" :href="packageUrl" target="_blank">
              {{ packageName }}
            </a>
          </div>
          <div class="overlay-indicator__tooltip__header__info__package-info">
            <div>{{ packageLicense }} license</div>
            <InlineSeparator></InlineSeparator>
            <div>{{ packageInfo?.stars }} stars</div>
          </div>
        </div>
      </div>

      <div class="overlay-indicator__tooltip__sources">
        <div class="overlay-indicator__tooltip__source" v-for="source in sources">
          <div class="overlay-indicator__tooltip__source__logo">
            <snyk-logo v-if="source.id === 'snyk'"></snyk-logo>
            <scorecards-logo v-if="source.id === 'depsDev'"></scorecards-logo>
            <socket-logo v-if="source.id === 'socket'"></socket-logo>
            <debricked-logo v-if="source.id === 'debricked'"></debricked-logo>
          </div>
          <div class="overlay-indicator__tooltip__source__info">
            <div class="overlay-indicator__tooltip__source__info__name">
              <a :href="source.reportUrl" target="_blank">
                <span v-if="source.id === 'snyk'">Snyk Advisor</span>
                <span v-if="source.id === 'depsDev'">OpenSSF Scorecard</span>
                <span v-if="source.id === 'socket'">Socket</span>
                <span v-if="source.id === 'debricked'">Debricked</span>
              </a>
            </div>

            <div class="overlay-indicator__tooltip__source__info__summary" :title="source.summary">
              {{ source.summary }}
            </div>
          </div>

          <div class="overlay-indicator__tooltip__source__issues" v-if="source.issues">
            <div class="overlay-indicator__tooltip__source__issues__wrapper">{{ source.issues }} issue</div>
          </div>

          <div class="overlay-indicator__tooltip__source__actions">
            <a :href="source.reportUrl" v-if="source.reportUrl" target="_blank">
              <open-external-link></open-external-link>
            </a>
          </div>
        </div>
      </div>

      <div class="overlay-indicator__tooltip__footer">
        Found an error? <a href="https://github.com/os-scar/overlay" target="_blank">please report an issue</a>
      </div>
    </div>
  </Tooltip>
</template>

<script>
import { defineComponent } from 'vue';
import Tooltip from './Tooltip.vue';
import OpenExternalLink from '../assets/open-extenal-link.svg?component';
import NpmLogo from '../assets/npm-logo.svg?component';
import PythonLogo from '../assets/python-logo.svg?component';
import SnykLogo from '../assets/snyk-logo.svg?component';
import ScorecardsLogo from '../assets/scorecards-logo.svg?component';
import SocketLogo from '../assets/socket-logo.svg?component';
import DebrickedLogo from '../assets/debricked-logo.svg?component';
import InlineSeparator from '../assets/inline-separator.svg?component';
import { usePackageInfo } from './store';

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export default defineComponent({
  name: 'overlay-indicator',
  components: {
    Tooltip,
    OpenExternalLink,
    InlineSeparator,
    NpmLogo,
    PythonLogo,
    SnykLogo,
    ScorecardsLogo,
    SocketLogo,
    DebrickedLogo,
  },
  props: {
    overlayIndicatorPackageType: {
      type: String,
      required: true,
    },
    overlayIndicatorPackageName: {
      type: String,
      required: true,
    },
    overlayIndicatorTooltipOpen: {
      type: Boolean,
      required: false,
      default: false,
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
    sources() {
      if (!this.packageInfo?.sources) return [];

      return Object.entries(this.packageInfo.sources).map(([sourceId, source]) => ({ ...source, id: sourceId }));
    },
    packageLicense() {
      return this.packageInfo?.licenses?.[0] || '';
    },
    packageName() {
      return this.overlayIndicatorPackageName;
    },
    packageType() {
      return this.overlayIndicatorPackageType;
    },
    packageUrl() {
      if (!this.packageInfo) {
        return;
      }

      if (this.packageType === 'npm') {
        return `https://www.npmjs.com/package/${this.packageName}`;
      }
      if (this.packageType === 'pypi') {
        return `https://pypi.org/project/${this.packageName}`;
      }
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

  &__tooltip {
    font-family: 'Roboto', sans-serif;
    background-color: $color-light-gray;
    width: $tooltip-width;

    div {
      box-sizing: border-box;
    }

    a {
      @include defuse-links();
    }

    $header-height: 40px;

    &__header {
      height: $header-height;
      background-color: $color-white;
      box-shadow: 0 1px 0 0 $color-border;
      flex-shrink: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: $padding-l2;
      padding-right: $padding-l2;

      &__logo {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
      }

      &__info {
        padding-left: $padding-l2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;

        &__package-name {
          font-size: 14px;
          font-weight: 500;
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex-grow: 1;
        }

        &__package-info {
          display: flex;
          flex-direction: row;
          color: #8b8b8b;
          font-size: 12px;
          font-weight: 400;
        }
      }
    }

    &__sources {
      padding-top: $padding-l2;
    }

    $source-height: 34px;

    &__source {
      height: $source-height;
      background-color: $color-white;
      box-shadow: inset 0 -1px 0 0 $color-border;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: $padding-l2;
      padding-right: $padding-l2;
      overflow: hidden;

      &__logo {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
      }

      &__info {
        padding-left: $padding-l2;
        padding-right: $padding-l2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        overflow: hidden;

        &__name {
          font-size: 12px;
          font-weight: 400;
        }

        &__summary {
          flex-grow: 1;
          color: #8b8b8b;
          font-size: 12px;
          font-weight: 400;
          max-width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      &__issues {
        flex-shrink: 0;
        justify-content: center;
        display: flex;
        align-items: center;

        &__wrapper {
          color: #fff;
          font-weight: 700;
          padding-left: $padding-l1;
          padding-right: $padding-l1;
          padding-top: 2px;

          font-size: 12px;
          border-radius: 4px;
          height: 18px;
          background: #fe2323;
          box-shadow: 0 0 0 1px #cf0000;
        }
      }

      &__actions {
        display: none;
        padding-left: $padding-l2;
        flex-shrink: 0;
      }

      $class-name: &;

      &:hover {
        #{$class-name}__actions {
          justify-content: center;
          display: flex;
          align-items: center;
        }
      }
    }

    &__footer {
      padding: $padding-l2;
      color: #757575;
      font-size: 12px;

      a {
        @include defuse-links(#757575, underline);
      }
    }
  }
}
</style>
