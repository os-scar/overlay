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
    let packageName = 'vmwc-vmwc-vmwc-vmwc-vmwc-vmwc-vmwc-vmwc-vmwc-vmwc';
    let packageType = 'pypi';
    return {
      packageType: packageType,
      packageName: packageName,
      packageData: {
        sources: {
          depsDev: {
            issues: 0,
            data: {
              latestVersion: '8.0.0',
              repo: 'https://github.com/sass/node-sass',
              licenses: ['MIT'],
              scorecard: {
                score: 4.3,
                metrics: {
                  'Maintained': 2,
                  'CII-Best-Practices': 0,
                  'License': 10,
                  'Branch-Protection': -1,
                  'Dangerous-Workflow': 10,
                  'Packaging': -1,
                  'Token-Permissions': 0,
                  'Binary-Artifacts': 10,
                  'Pinned-Dependencies': 7,
                  'Fuzzing': 0,
                  'Vulnerabilities': 10,
                  'Security-Policy': 0,
                  'Signed-Releases': 0,
                },
              },
              stars: 8364,
            },
          },
          socket: {
            issues: 0,
            data: {
              supplyChainRisk: { score: 61, level: 'WARNING' },
              quality: { score: 63, level: 'WARNING' },
              maintenance: { score: 77, level: 'WARNING' },
              vulnerability: { score: 100, level: 'GOOD' },
              license: { score: 79, level: 'WARNING' },
            },
          },
          snyk: {
            issues: 1,
            data: {
              score: 79,
              maxScore: 100,
              level: 'WARNING',
              badges: {
                security: { level: 'BAD', description: 'Security issues found' },
                popularity: { level: 'GOOD', description: 'Key ecosystem project' },
                maintenance: { level: 'GOOD', description: 'Healthy' },
                community: { level: 'GOOD', description: 'Active' },
              },
            },
          },
          debricked: {
            issues: 0,
            data: {
              Contributors: {
                description:
                  'Open Source projects consists of contributors. When deciding what open source to bring in to your software, it is important to inspect and analyse the contributors of a project.',
                score: 49,
                level: 'WARNING',
              },
              Popularity: {
                description:
                  'The popularity of a repository is a rather crucial indicator of the health of a project. It signifies interest from both developers and users alike, pointing towards viability and continued development.',
                score: 57,
                level: 'WARNING',
              },
              Security: {
                description:
                  'The security of a repository is important in many aspects of open source. This metric is impactful to the risk associated with an open source project, as it measures both indicators of vulnerability entry risk, and past vulnerability response performance. ',
                score: 69,
                level: 'WARNING',
              },
            },
          },
        },
        latest: '8.0.0',
        licenses: ['MIT'],
        stars: 8364,
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
