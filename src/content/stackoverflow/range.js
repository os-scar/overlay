const findPositionInsideTree = (node, position) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return { node, position };
  }
  for (const child of node.childNodes) {
    if (position <= child.textContent.length) return findPositionInsideTree(child, position);
    position -= child.textContent.length;
  }
};

export const getRangeOfPositions = (element, textStart, length) => {
  const start = findPositionInsideTree(element, textStart);
  const end = findPositionInsideTree(element, textStart + length);

  const range = new Range();
  range.setStart(start.node, start.position);
  range.setEnd(end.node, end.position);

  return range;
};