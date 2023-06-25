<template>
  <div class="overlay-indicator__tooltip" :data-testId="packageName">
    <div class="overlay-indicator__tooltip__header">
      <div class="overlay-indicator__tooltip__header__logo">
        <component :is="registryLogo" />
      </div>

      <div class="overlay-indicator__tooltip__header__info">
        <div class="overlay-indicator__tooltip__header__info__package-name">
          <a :title="packageName" :href="packageUrl" target="_blank">
            {{ packageName }}
          </a>
        </div>
        <div class="overlay-indicator__tooltip__header__info__package-info">
          <div v-show="packageLicense">{{ packageLicense }} license</div>
          <InlineSeparator v-show="packageLicense"></InlineSeparator>
          <div>{{ packageInfo?.stars }} stars</div>
        </div>
      </div>
    </div>

    <div class="overlay-indicator__tooltip__sources">
      <div class="overlay-indicator__tooltip__source" v-for="source in sources">
        <div class="overlay-indicator__tooltip__source__logo">
          <component :is="advisoryLogo(source.id)" />
        </div>
        <div class="overlay-indicator__tooltip__source__info">
          <div class="overlay-indicator__tooltip__source__info__name">
            <a :href="source.reportUrl" target="_blank">
              <span>{{ advisoryDisplayName(source.id) }}</span>
            </a>
          </div>

          <div class="overlay-indicator__tooltip__source__info__summary" :title="source.summary">
            {{ source.summary }}
          </div>
        </div>

        <div class="overlay-indicator__tooltip__source__issues" v-if="source.issues">
          <div class="overlay-indicator__tooltip__source__issues__wrapper">
            {{ source.issues }} issue{{ source.issues !== 1 ? 's' : '' }}
          </div>
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
</template>

<script>
import { defineComponent } from 'vue';
import advisories from '../advisories';
import DebrickedLogo from '../assets/debricked-logo.svg?component';
import InlineSeparator from '../assets/inline-separator.svg?component';
import NpmLogo from '../assets/npm-logo.svg?component';
import OpenExternalLink from '../assets/open-extenal-link.svg?component';
import PythonLogo from '../assets/python-logo.svg?component';
import ScorecardsLogo from '../assets/scorecards-logo.svg?component';
import SnykLogo from '../assets/snyk-logo.svg?component';
import SocketLogo from '../assets/socket-logo.svg?component';
import { usePackageInfo } from './store';

const registries = {
  npm: NpmLogo,
  pypi: PythonLogo,
};

const logos = {
  snyk: SnykLogo,
  depsDev: ScorecardsLogo,
  socket: SocketLogo,
  debricked: DebrickedLogo,
};

export default defineComponent({
  name: 'package-report',
  components: {
    OpenExternalLink,
    InlineSeparator,
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
    stylesheetUrl: {
      type: String,
      required: false,
    },
  },

  setup(props) {
    const packageInfo = usePackageInfo(props.packageType, props.packageName);
    return { packageInfo };
  },

  mounted() {
    if (!this.stylesheetUrl) return;

    // Pypi: CSP: The page’s settings blocked the loading of a resource at inline (“style-src”)
    // We need to load the stylesheet as a file, inside the custom-element.
    // https://github.com/os-scar/overlay/issues/75#issuecomment-1538224560
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = this.stylesheetUrl;
    this.$el.parentNode.appendChild(link);
  },

  computed: {
    packageLicense() {
      return this.packageInfo?.licenses?.[0] || '';
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
    sources() {
      if (!this.packageInfo?.sources) return [];

      return Object.entries(this.packageInfo.sources).map(([sourceId, source]) => ({ ...source, id: sourceId }));
    },
    registryLogo() {
      return registries[this.packageType];
    },
  },

  methods: {
    advisoryDisplayName(advisoryName) {
      return advisories[advisoryName];
    },
    advisoryLogo(advisoryName) {
      return logos[advisoryName];
    },
  },
});
</script>

<style lang="scss">
@use './variables' as *;

.overlay-indicator {
  div {
    box-sizing: border-box;
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
