import { describe, expect, it } from '@jest/globals';
import { getRangeOfPositions } from './range';

const createNode = (content) => {
  const div = document.createElement('div');
  div.innerHTML = content;
  return div.firstChild;
};

const getTextPosition = (node, substring) => {
  return {
    start: node.textContent.indexOf(substring),
    length: substring.length,
  };
};

describe('range', () => {
  it('should find the range for text node', () => {
    const textNode = createNode('This is a text');
    const expectedText = 'is a';
    const { start, length } = getTextPosition(textNode, expectedText);
    const range = getRangeOfPositions(textNode, start, length);

    expect(range.toString()).toBe(expectedText);
  });

  it('should find inside childNode', () => {
    const nodeWithChildTextNode = createNode('<p>This is a text</p>');
    const expectedText = 'is a';
    const { start, length } = getTextPosition(nodeWithChildTextNode, expectedText);

    const range = getRangeOfPositions(nodeWithChildTextNode, start, length);

    expect(range.toString()).toBe(expectedText);
  });

  it('should find inside two different nodes', () => {
    const nodeWithTwoNodes = createNode('<p><span>This is</span><span> a</span> text</p>');
    const expectedText = 'is a';
    const { start, length } = getTextPosition(nodeWithTwoNodes, expectedText);

    const range = getRangeOfPositions(nodeWithTwoNodes, start, length);
    expect(range.toString()).toBe(expectedText);
  });

  it('should skip node between text', () => {
    const nodeWithChildNodeBetween = createNode('<p>This <span>is a</span> text</p>');
    const expectedText = 'This is a text';
    const { start, length } = getTextPosition(nodeWithChildNodeBetween, expectedText);

    const range = getRangeOfPositions(nodeWithChildNodeBetween, start, length);

    expect(range.toString()).toBe(expectedText);
  });
});
