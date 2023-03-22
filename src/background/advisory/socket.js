import cache from '../cache';

/**
 * @typedef {{
 *   score: Record<string, {
 *     score: number
 *   }>
 * }} SocketPackageResponse
 *
 * The scores received from @see SocketPackageResponse
 *
 * The metric scores are between 0-1, multiplied by 100 and rounded up (ceil) to get 1-100 score.
 * The response includes 'miscellaneous' that didn't displayed on UI.
 *
 * Score between 0 to 59 (was 0.59) will be red.
 * Score between 60 (0.591) to 79 (0.79) will be orange.
 * Score above 80 (0.791) will be green.
 */

const getLevel = (score) => {
  if (score >= 80) return 'GOOD';
  if (score >= 60) return 'WARNING';
  return 'BAD';
};

/** @returns {Promise<SocketPackageResponse>} */
const getPackageDetails = (type, name) =>
  cache(['socket', type, name], () => fetch(`https://socket.dev/api/${type}/package-info/score?name=${name}`).then((r) => r.json()));

const typesMap = {
  npm: 'npm',
  // pypi: 'pypi', // score is not available for pypi
};

export default async ({ type, name }) => {
  if (!typesMap[type]) return null;
  const { score: scoresList } = await getPackageDetails(typesMap[type], name);

  let issues = 0;
  const scores = Object.entries(scoresList)
    .filter(([scoreName, { score }]) => scoreName !== 'miscellaneous' && typeof score === 'number')
    .reduce((acc, [scoreName, { score }]) => {
      const roundedScore = Math.ceil(score * 100);
      const level = getLevel(roundedScore);
      if (level === 'BAD') issues++;

      acc[scoreName] = { score: roundedScore, level };
      return acc;
    }, {});

  return {
    issues,
    data: scores,
  };
};
