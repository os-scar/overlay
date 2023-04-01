<template>
  <div class="wrapper">
    <Indicator :overlay-indicator-package-name="packageName" :overlay-indicator-package-type="packageType"> test </Indicator>
  </div>
</template>

<script>
import Indicator from '../../../src/custom-elements/Indicator.vue';
import * as store from '../../../src/custom-elements/store.js';

export default {
  components: { Indicator },
  data() {
    let packageName = 'my-long-package-name';
    let packageType = 'npm';
    return {
      packageType: packageType,
      packageName: packageName,
      packageData: {
        name: packageName,
        loading: true, // indicating the package info is loading
        type: packageType,
        license: 'MIT',
        latest: '1.2.3',
        created: 1677996776, // epoch utc
        stars: 50000,
        sources: {
          checkmarx: {
            error: true, // indicating error occured
          },
          snyk: {
            loading: true, // indicating data is still loading
          },
          socket: {
            issues: 3,
            data: {
              supplyChainScore: 100,
              qualityScore: 74,
              maintenanceScore: 78,
              vulnerabilitiesScore: 100,
              licenseScore: 88,
            },
          },
          openbase: {
            issues: 3,
            data: {
              userRatingScore: 4.8,
              userFeedback: [
                {
                  name: 'Easy to use',
                  positive: true,
                },
                {
                  name: 'Great Documentation',
                  positive: true,
                },
                {
                  name: 'Performant',
                  positive: true,
                },
                {
                  name: 'Bleeding Edge',
                  positive: false, // will be displayed as bad
                },
                {
                  name: 'Highly Customizable',
                  positive: false, // will be displayed as bad
                },
                {
                  name: 'Responsive Maintainers',
                  positive: false, // will be displayed as bad
                },
              ],
            },
          },
          depsDev: {
            issues: 3,
            data: {
              score: 7.5,
              checks: [
                {
                  description: 'Using protected branches',
                  score: 3.2,
                },
                {
                  description: 'signed commits',
                  score: 5.2,
                },
                // more scorecards items...
              ],
            },
          },
          debricked: {
            issues: 3,
            data: {
              contributorsScore: 77,
              popularityScore: 82,
              securityScore: 59,
            },
          },
        },
      },
    };
  },
  watch: {
    packageData: () => {
      this.updatePackageInfo();
    },
  },
  methods: {
    updatePackageInfo() {
      console.log(1);
      store.updatePackageInfo({ type: this.packageType, name: this.packageName }, 'info', this.packageData);
    },
  },
  mounted() {
    this.updatePackageInfo();
  },
};
</script>

<style lang="scss">
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
