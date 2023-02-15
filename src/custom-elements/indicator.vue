<template>
    <div class="overlay-indicator" ref="overlay" @mouseenter="initTooltipPosition(); tooltipOpen=true" @mouseleave="tooltipOpen=false">
        <div>
            <slot></slot>
        </div>
        <div class="overlay-indicator__tooltip" ref="overlayTooltip" v-show="tooltipOpen">
            {{ package.name }}
            <div class="overlay-indicator__tooltip__item" v-for="source in package.sources">
                {{ source }}
            </div>
        </div>
    </div>
</template>

<script>

const TOOLTIP_POSITION = {
    TOP_START: "top_start",
    TOP_END: "top_end",
    TOP: "top",
    BOTTOM_START: "bottom_start",
    BOTTOM_END: "bottom_end",
    BOTTOM: "bottom",
    LEFT_START: "left_start",
    LEFT_END: "left_end",
    LEFT: "left",
    RIGHT_START: "right_start",
    RIGHT_END: "right_end",
    RIGHT: "right"
};

export default {
    name: "overlay-indicator",
    props: [
        "overlayIndicatorPackageType",
        "overlayIndicatorPackageName"
    ],
    data() {
        return {
            tooltipOpen: false
        };
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
                        loading: true
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
                                { name: "Easy to use", positive: true },
                                { name: "Great Documentation", positive: true },
                                { name: "Performant", positive: true },
                                { name: "Bleeding Edge", positive: false },
                                { name: "Highly Customizable", positive: false },
                                { name: "Responsive Maintainers", positive: false }
                            ]
                        }
                    },
                    {
                        name: "scorecards",
                        data: {
                            "score": 7.5,
                            "checks": [
                                { "description": "Using protected branches", score: 3.2 },
                                { "description": "signed commits", score: 5.2 }
                            ]
                        }
                    },
                    {
                        name: "debricked",
                        error: true
                    }
                ]
            };
        }
    },
    methods: {
        initTooltipPosition() {
            let baseElement = this.$refs.overlay,
                tooltipElement = this.$refs.overlayTooltip,
                tooltipPosition = TOOLTIP_POSITION.BOTTOM;
            let parent = baseElement.getRootNode().host;
            parent.style.position = "absolute"
            this.placeTooltip(baseElement, tooltipElement, tooltipPosition);
        },
        placeTooltip(baseElement, tooltipElement, tooltipPosition) {
            const baseRect = baseElement.getBoundingClientRect();
            const tooltipRect = tooltipElement.getBoundingClientRect();
            const parent = baseElement.getRootNode().host || document;
            let targetPosition = this.getPosition(baseRect, tooltipRect, tooltipPosition);
            const parentRect = parent === document ? this.getDocumentBoundingRect() : parent.getBoundingClientRect();
            if (this.shouldFlip(targetPosition, tooltipRect, parentRect, tooltipPosition)) {
                console.debug("Flipping tooltip position");
                tooltipPosition = this.getOppositePosition(tooltipPosition);
                targetPosition = this.getPosition(baseRect, tooltipRect, tooltipPosition);
            }

            tooltipElement.style.left = targetPosition.left + "px";
            tooltipElement.style.top = targetPosition.top + "px";
        },
        getPosition(baseRect, tooltipRect, tooltipPosition) {
            const basePadding = 4;
            tooltipRect.width = tooltipRect.width || 260;
            tooltipRect.height = tooltipRect.height || 400;
            switch (tooltipPosition) {
                case TOOLTIP_POSITION.TOP_START:
                    return {
                        top: basePadding - tooltipRect.height,
                        left: baseRect.left
                    };
                case TOOLTIP_POSITION.TOP_END:
                    return {
                        top: basePadding - tooltipRect.height,
                        left: baseRect.left + baseRect.width - tooltipRect.width - basePadding
                    };
                case TOOLTIP_POSITION.TOP:
                    return {
                        top:  0 - tooltipRect.height,
                        left: baseRect.width / 2 - tooltipRect.width / 2
                    };
                case TOOLTIP_POSITION.BOTTOM_START:
                    return {
                        top: baseRect.height + basePadding,
                        left: baseRect.left
                    };
                case TOOLTIP_POSITION.BOTTOM_END:
                    return {
                        top: baseRect.height + basePadding,
                        left: baseRect.width - tooltipRect.width - basePadding
                    };
                case TOOLTIP_POSITION.BOTTOM:
                    return {
                        top: baseRect.height + basePadding,
                        left:(baseRect.width / 2) - (tooltipRect.width / 2)
                    };
                case TOOLTIP_POSITION.LEFT_START:
                    return {
                        top: basePadding,
                        left: tooltipRect.width - basePadding
                    };
                case TOOLTIP_POSITION.LEFT_END:
                    return {
                        top: baseRect.height - tooltipRect.height - basePadding,
                        left: tooltipRect.width - basePadding
                    };
                case TOOLTIP_POSITION.LEFT:
                    return {
                        top: baseRect.top + baseRect.height / 2 - tooltipRect.height / 2,
                        left: baseRect.left - tooltipRect.width - basePadding
                    };
                case TOOLTIP_POSITION.RIGHT_START:
                    return {
                        top: baseRect.top,
                        left: baseRect.width + basePadding
                    };
                case TOOLTIP_POSITION.RIGHT_END:
                    return {
                        top: baseRect.height - tooltipRect.height - basePadding,
                        left: baseRect.left + baseRect.width
                    };
                case TOOLTIP_POSITION.RIGHT:
                    return {
                        top: baseRect.height / 2 - tooltipRect.height / 2,
                        left: baseRect.width + basePadding
                    };
                default:
                    console.error("Unknown tooltip position", tooltipPosition);
                    return {
                        top: baseRect.height + basePadding,
                        left: baseRect.left + baseRect.width + basePadding
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
                height: height
            };
        },
        shouldFlip(targetPosition, tooltipRect, boundaryRect, position) {
            tooltipRect.width = tooltipRect.width || 260;
            tooltipRect.height = tooltipRect.height || 440;
            switch (position) {
                case TOOLTIP_POSITION.TOP_START:
                    return targetPosition.top > boundaryRect.top;
                case TOOLTIP_POSITION.TOP:
                    return targetPosition.top > boundaryRect.top;
                case TOOLTIP_POSITION.TOP_END:
                    return targetPosition.top > boundaryRect.top;
                case TOOLTIP_POSITION.BOTTOM_START:
                    return targetPosition.top + tooltipRect.height > boundaryRect.bottom;
                case TOOLTIP_POSITION.BOTTOM:
                    return targetPosition.top + tooltipRect.height < boundaryRect.bottom;
                case TOOLTIP_POSITION.BOTTOM_END:
                    return targetPosition.top + tooltipRect.height < boundaryRect.bottom;
                case TOOLTIP_POSITION.LEFT_START:
                    return targetPosition.left > boundaryRect.left;
                case TOOLTIP_POSITION.LEFT:
                    return targetPosition.left > boundaryRect.left;
                case TOOLTIP_POSITION.LEFT_END:
                    return targetPosition.left > boundaryRect.left;
                case TOOLTIP_POSITION.RIGHT_START:
                    return targetPosition.left + tooltipRect.width < boundaryRect.right;
                case TOOLTIP_POSITION.RIGHT:
                    return targetPosition.left + tooltipRect.width < boundaryRect.right;
                case TOOLTIP_POSITION.RIGHT_END:
                    return targetPosition.left + tooltipRect.width < boundaryRect.right;
            }
        }
    },
    mounted() {
        this.initTooltipPosition();
    },

};

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
    display: inline-flex;
    position: relative;

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
