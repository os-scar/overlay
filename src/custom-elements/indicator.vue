<template>
  <div class="tooltip">
    <div class="tooltip__top_row">
      <div class="tooltip__top_row__metadata">
        <div class="tooltip__top_row__name">{{ getPackageMetadata.name }}</div>
        <div class="tooltip__top_row__type">
          <component :is="this.getPackageMetadata.type+'Logo'"></component>
        </div>

        <div class="tooltip__top_row__stars">
          {{ getPackageMetadata.stars }}
          <star-icon></star-icon>
        </div>
      </div>
      <div class="tooltip__top_row__expand">
        <expand-icon></expand-icon>
      </div>
    </div>
    <div class="tooltip__vendors">
      {{ vendors }}
      <div class="tooltip__vendors__vendor" v-for="vendor in this.getVendors">
        <div class="tooltip__vendors__vendor__metadata">
          <component :class="vendor.name.replace('.', '')+'_logo'" :is="vendor.name.replace('.', '')+'Logo'"></component>
          <div class="tooltip__vendors__vendor__name">{{ vendor.name }}</div>
        </div>
        <div class="tooltip__vendors__vendor__scorecard" :class="'scorecard_' + vendor.flags.score_type" v-if="vendor.scores">
          <div class="tooltip__vendors__vendor__scorecard__indicator" :class="'indicator_' + vendor.flags.score_type" v-if="vendor.flags">
            <component class="tooltip__vendors__vendor__scorecard__indicator__icon" :is="vendor.flags.score_type+'Indicator'"/>
            <div class="tooltip__vendors__vendor__scorecard__indicator__count" v-if="vendor.flags.score_type === 'bad'">{{ vendor.flags.count }}</div>
          </div>
          <div class="tooltip__vendors__vendor__scorecard__score">
            <div class="tooltip__vendors__vendor__scorecard__score__value">{{ vendor["tooltipScore"]["score"][0] }} / {{ vendor["tooltipScore"]["score"][1] }}</div>
            <div class="tooltip__vendors__vendor__scorecard__score__name">{{ vendor["tooltipScore"]["scoreName"] }}</div>
          </div>
        </div>
        <div class="tooltip__vendors__vendor__scorecard--loading" v-else></div>

      </div>
    </div>
  </div>
</template>

<script>
import badIndicator from './assets/bad_indicator.svg?component'
import goodIndicator from './assets/good_indicator.svg?component'
import starIcon from './assets/star_icon.svg?component'
import expandIcon from './assets/expand_icon.svg?component'
import npmLogo from './assets/npm_logo.svg?component'
import depsdevLogo from './assets/deps.dev_logo.svg?component'
import snykLogo from './assets/snyk_logo.svg?component'
import socketLogo from './assets/socket_logo.svg?component'
import debrickedLogo from './assets/debricked_logo.svg?component'
import openbaseLogo from './assets/openbase_logo.svg?component'

export default {
  name: 'overlay-indicator',
  components: {
    badIndicator,
    goodIndicator,
    starIcon,
    expandIcon,
    npmLogo,
    depsdevLogo,
    snykLogo,
    socketLogo,
    debrickedLogo,
    openbaseLogo
  },
  data() {
    return {
      mainScoresByVendor: {
        "deps.dev": "Scorecard",
        "snyk": "Health Score",
        "socket": "Supply-Chain",
        "debricked": "Security",
        "openbase": "User Rating"
      }
    }
  },
  computed: {
    getPackageMetadata() {
      if (!this.packageMetadata) {
        return {};
      }
      return JSON.parse(this.packageMetadata);
    },
    * getVendors() {
      if (!this.vendors) {
        return {};
      }
      let vendors = JSON.parse(this.vendors);
      console.log(vendors)
      for (let vendor of vendors) {
        let vendorName = Object.keys(vendor)[0];
        let vendorScores = vendor[vendorName];
        if (Object.keys(vendorScores).length === 0) {
          vendorScores = false;
        }
        yield {
          "name": vendorName,
          "scores": vendorScores,
          "tooltipScore": this.tooltipScores(vendor),
          "flags": this.scoreFlags(vendor)
        }
      }
    }
  },
  methods: {
    tooltipScores(vendor) {
      if (!vendor) {
        return [];
      }

      let name = Object.keys(vendor)[0];
      let scores = vendor[name];
      if (!scores) {
        return {"scoreName": false, "score": false};
      }
      let mainScore = this.mainScoresByVendor[name];
      return {"scoreName": mainScore, "score": scores[mainScore]};

    },
    scoreFlags(vendor) {
      if (!vendor) {
        console.log("no vendor!!")
        return []
      }

      let name = Object.keys(vendor)[0]
      console.log(name)
      let scores = Object.values(vendor[name]);
      console.log(scores)

      let flags = {
        'good': 0,
        'neutral': 0,
        'bad': 0
      }

      scores.forEach((score) => {
        if (typeof score === "boolean") {
          if (score) {
            flags['good'] += 1;
            return
          }
          flags['bad'] += 1
          return
        }

        let score_value = score[0];
        let score_max = score[1];

        if (score_value < score_max / 2) {
          flags['bad'] += 1
          return
        }

        if (score_value > score_max * 0.75) {
          flags['good'] += 1;
          return
        }
        flags['neutral'] += 1;
      })


      if (flags['bad'] > 0) {
        return {'score_type': 'bad', 'count': flags['bad']}
      }
      if (flags['neutral'] === 0) {
        return {'score_type': 'good', 'count': flags['good']}
      }
      return false
    }
  }
}

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
    position: absolute;
    padding: 20px;
    z-index: 1000;
    background: #eee;
    width: 260px;
    height: 400px;
    overflow: scroll;
  }
}
</style>
