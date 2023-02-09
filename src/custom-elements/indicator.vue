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
  props: [
    'packageMetadata',
    'vendors'
  ],
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
// fonts should be externally loaded @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@200;300;400;500;600;700;800;900&display=swap');


$font-family: "Lexend", sans-serif;
$font-size-title: 12px;
$font-size-score-value: 10px;
$font-size-score-name: 8px;

$padding-l1: 4px;
$padding-l2: 8px;
$padding: 8px;
$border-radius: 6px;


$color-red: #FF4D4D;
$color-green: #4CDB62;

$border-all-black: 0 0 0 1px #000;
$border-all-red: 0 0 0 1px $color-red;
$border-all-green: 0 0 0 1px $color-green;

* {
  box-sizing: border-box;
}

.tooltip {
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 100%;
  background: white;
  filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.1));
  color: black;
  font-size: $font-size-title;
  padding: $padding-l1;
  border-radius: $border-radius;
  gap: $padding-l1;

  font-family: $font-family;

  &__top_row {
    height: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 0 0 #E6E6E6;

    &__metadata {
      display: flex;
      flex-direction: row;
      gap: $padding;
      align-items: flex-end;
    }

    &__type {
      width: 30px;
      display: flex;
      align-items: baseline;

      &__icon {
        width: 100%;
      }
    }

    &__stars {
      display: flex;
      flex-direction: row;
      gap: 1px;
      align-items: center;
      justify-content: center;
    }

    &__name {
      font-weight: 700;
      font-size: $font-size-title;
    }

    &__expand {
      width: 20px;
      height: 20px;
    }
  }

  &__vendors {
    display: flex;
    flex-direction: column;
    gap: $padding-l1;

    &__vendor {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &__metadata {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
      }

      &__icon {
        width: 12px;
        height: 20px;
        background: black;
      }

      &__scorecard {
        height: 26px;
        border-radius: $border-radius;
        display: flex;
        flex-direction: row;
        box-shadow: $border-all-black;


        &__score {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 0 $padding-l1;
          width: 60px;


          &__value {
            font-size: $font-size-score-value;
            font-weight: 900;
          }

          &__name {
            font-size: $font-size-score-name;
          }
        }

        &__indicator {

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;

          height: 100%;
          width: 20px;
          border-radius: $border-radius;

          &__count {
            font-size: $font-size-score-value;
          }

          &__icon {
          }

        }

        &--loading {
          height: 26px;
          min-width: 60px;
          animation: skeleton-loading 1s linear infinite alternate;
          border-radius: $border-radius;
        }

        @keyframes skeleton-loading {
          0% {
            background-color: hsl(200, 20%, 80%);
          }
          100% {
            background-color: hsl(200, 20%, 90%);
          }
        }

      }
    }


  }
}

.scorecard_bad {
  box-shadow: $border-all-red;
}

.scorecard_good {
  box-shadow: $border-all-green;
}

.indicator_bad {
  box-shadow: $border-all-red;
  background: $color-red;
}

.indicator_good {
  box-shadow: $border-all-green;
  background: $color-green;
}

</style>
