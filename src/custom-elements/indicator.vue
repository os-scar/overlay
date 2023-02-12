<template>
  <div class="overlay-indicator" ref="overlay">
    <slot></slot>
    <div class="overlay-indicator__tooltip" ref="">
      {{ package.name }}
      <div class="overlay-indicator__tooltip__item" v-for="source in package.sources">
        {{ source }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'overlay-indicator',
  props: [
    'overlayIndicatorPackageType',
    'overlayIndicatorPackageName'
  ],
  data() {
    return {}
  },
  computed: {
    package() {
      return {
        name: "react",
        type: "npm",
        created: new Date(),
        stars: 50000,
        sources: [
          {
            name: "checkmarx",
            loading: true,
          },
          {
            name: "socket.dev",
            issues: 3,
            data: {
              "supplyChain": 100,
              "quality": 74,
              "maintenance": 78,
              "vulnerabilities": 100,
              "license": 88
            }
          },
          {
            name: "socket.dev",
            data: {
              "userRating": 4.8,
              "userFeedback": [
                {name: "Easy to use", positive: true},
                {name: "Great Documentation", positive: true},
                {name: "Performant", positive: true},
                {name: "Bleeding Edge", positive: false},
                {name: "Highly Customizable", positive: false},
                {name: "Responsive Maintainers", positive: false},
              ]
            }
          },
          {
            name: "scorecards",
            data: {
              "score": 7.5,
              "checks": [
                {"description": "Using protected branches", score: 3.2},
                {"description": "signed commits", score: 5.2},
              ],
            }
          },
          {
            name: "debricked",
            error: true,
          }
        ]
      }
    }
  },
  methods: {}
}

</script>

<style lang="scss" scoped>

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

div {
  box-sizing: border-box;
}

.overlay-indicator {

  &__tooltip{
    padding: 20px;
    background: #eee;
  }
}

</style>
