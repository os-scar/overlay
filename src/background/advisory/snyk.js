// https://snyk.io/advisor/npm-package/react
import * as cheerio from 'cheerio';
import cache from '../cache';

const SNYK_SCORE_SELECTOR = '.health .number span';
const SNYK_SCORE_BAR_SELECTOR = '.health .score-bar .value';
const SNYK_SECURITY_SCORE_SELECTOR = '.health ul.scores li';

const barLevelToLevel = {
  green: 'GOOD',
  orange: 'WARNING',
  red: 'BAD',
};

const classToLevel = {
  'vue--pill--success': 'GOOD',
  'vue--pill--warning': 'WARNING',
  'vue--pill--danger': 'BAD',
};

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

    let issues = 0;
    const badges = $(SNYK_SECURITY_SCORE_SELECTOR)
      .toArray()
      .reduce((acc, li) => {
        const category = $(li).find('> span').text();
        const border = $(li).find('a div');
        const level = getLevelFromClassList(border);
        const description = border.text();

        if (level === 'BAD') issues++;

        acc[category] = { level, description };
        return acc;
      }, {});

    return {
      issues,
      data: {
        score,
        maxScore,
        level,
        badges,
      },
    };
  });

const typesMap = {
  npm: 'npm-package',
};

export default async ({ type, name }) => {
  return scrapeScoreFromSnyk(typesMap[type], name);
};
