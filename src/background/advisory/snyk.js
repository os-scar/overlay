/// <reference path="../../types.js" />
// @ts-check
// https://snyk.io/advisor/npm-package/react
import * as cheerio from 'cheerio';
import cache from '../cache';

const SNYK_SCORE_SELECTOR = '.health .number span';
const SNYK_SCORE_BAR_SELECTOR = '.health .score-bar .value';
const SNYK_SECURITY_SCORE_SELECTOR = '.health ul.scores li';

/** @type {Record<string, Level>} */
const barLevelToLevel = {
  green: 'GOOD',
  orange: 'WARNING',
  red: 'BAD',
};

/** @type {Record<string, Level>} */
const classToLevel = {
  'vue--pill--success': 'GOOD',
  'vue--pill--warning': 'WARNING',
  'vue--pill--danger': 'BAD',
};

/** @param {cheerio.Cheerio<cheerio.Element> } element */
const getLevelFromClassList = (element) => {
  for (let cls in classToLevel) {
    if (element.hasClass(cls)) return classToLevel[cls];
  }
};

const scrapeScoreFromSnyk = (registry, packageName) =>
  cache(['snyk', registry, packageName], async () => {
    const html = await fetch(`https://snyk.io/advisor/${registry}/${packageName}`, {
      method: 'GET',
      redirect: 'follow',
    }).then((r) => r.text());

    const $ = cheerio.load(html);
    const scoreTxt = $(SNYK_SCORE_SELECTOR).text();
    const [score, maxScore] = scoreTxt?.split('/').map((n) => Number.parseInt(n.trim())) || [];
    const level = barLevelToLevel[$(SNYK_SCORE_BAR_SELECTOR).attr()['data-level']];

    const badges = $(SNYK_SECURITY_SCORE_SELECTOR)
      .toArray()
      .reduce((acc, li) => {
        const category = $(li).find('> span').text();
        const border = $(li).find('a div');
        const level = getLevelFromClassList(border);
        const description = border.text();

        acc[category] = { level, description };
        return acc;
      }, /** @type {Record<string, { level: String, description: string }>} */ ({}));

    return { isBad: level === 'BAD', score, maxScore, level, badges };
  });

const typesMap = {
  npm: 'npm-package',
};

export default async ({ type, name }) => {
  return scrapeScoreFromSnyk(typesMap[type], name);
};
