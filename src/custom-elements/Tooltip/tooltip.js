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

function getOppositePosition(position) {
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
}

function getPosition(activatorRect, tooltipRect, tooltipPosition) {
  const basePadding = 4;
  tooltipRect.width = tooltipRect.width || 260;
  tooltipRect.height = tooltipRect.height || 200;
  let pageOffset = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  switch (tooltipPosition) {
    case TOOLTIP_POSITION.TOP_START:
      return {
        top: pageOffset + activatorRect.top - basePadding - tooltipRect.height,
        left: activatorRect.left,
      };
    case TOOLTIP_POSITION.TOP_END:
      return {
        top: pageOffset + activatorRect.top - basePadding - tooltipRect.height,
        left: activatorRect.left - activatorRect.width - tooltipRect.width - basePadding,
      };
    case TOOLTIP_POSITION.TOP:
      return {
        top: pageOffset + activatorRect.top - tooltipRect.height,
        left: activatorRect.left + activatorRect.width / 2 - tooltipRect.width / 2,
      };
    case TOOLTIP_POSITION.BOTTOM_START:
      return {
        top: pageOffset + activatorRect.top + activatorRect.height + basePadding,
        left: activatorRect.left + basePadding,
      };
    case TOOLTIP_POSITION.BOTTOM_END:
      return {
        top: pageOffset + activatorRect.top + activatorRect.height + activatorRect.height + basePadding,
        left: activatorRect.left - activatorRect.width - tooltipRect.width - basePadding,
      };
    case TOOLTIP_POSITION.BOTTOM:
      if (activatorRect.left + activatorRect.width / 2 - tooltipRect.width / 2 < 0) {
        return {
          top: pageOffset + activatorRect.top + activatorRect.height + basePadding,
          left: activatorRect.left + activatorRect.width / 2,
        };
      }
      return {
        top: pageOffset + activatorRect.top + activatorRect.height + basePadding,
        left: activatorRect.left + activatorRect.width / 2 - tooltipRect.width / 2,
      };
    case TOOLTIP_POSITION.LEFT_START:
      return {
        top: pageOffset + activatorRect.top + basePadding,
        left: activatorRect.left - tooltipRect.width - basePadding,
      };
    case TOOLTIP_POSITION.LEFT_END:
      return {
        top: pageOffset + activatorRect.top - activatorRect.height - tooltipRect.height - basePadding,
        left: activatorRect.left - tooltipRect.width - basePadding,
      };
    case TOOLTIP_POSITION.LEFT:
      return {
        top: pageOffset + activatorRect.top + activatorRect.height / 2 - tooltipRect.height / 2,
        left: activatorRect.left - tooltipRect.width - basePadding,
      };
    case TOOLTIP_POSITION.RIGHT_START:
      return {
        top: pageOffset + activatorRect.top,
        left: activatorRect.left + activatorRect.width + basePadding,
      };
    case TOOLTIP_POSITION.RIGHT_END:
      return {
        top: pageOffset + activatorRect.top - activatorRect.height - tooltipRect.height - basePadding,
        left: activatorRect.left + activatorRect.width,
      };
    case TOOLTIP_POSITION.RIGHT:
      return {
        top: pageOffset + activatorRect.top + activatorRect.height / 2 - tooltipRect.height / 2,
        left: activatorRect.left + activatorRect.width + basePadding,
      };
    default:
      return {
        top: pageOffset + activatorRect.top + activatorRect.height + basePadding,
        left: activatorRect.left + activatorRect.width + basePadding,
      };
  }
}

function getDocumentBoundingRect() {
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
}

function shouldFlip(targetPosition, tooltipRect, boundaryRect, position) {
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
}

export function initTooltipPosition(activatorElement, tooltipElement, tooltipPosition = TOOLTIP_POSITION.BOTTOM) {
  const activatorRect = activatorElement.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect() || {};
  const parent = activatorElement.getRootNode().host || document;
  let targetPosition = getPosition(activatorRect, tooltipRect, tooltipPosition);
  const parentRect = parent === document ? getDocumentBoundingRect() : parent.getBoundingClientRect();
  if (shouldFlip(targetPosition, tooltipRect, parentRect, tooltipPosition)) {
    tooltipPosition = getOppositePosition(tooltipPosition);
    targetPosition = getPosition(activatorRect, tooltipRect, tooltipPosition);
  }
  tooltipElement.style.left = targetPosition.left + 'px';
  tooltipElement.style.top = targetPosition.top + 'px';
}
