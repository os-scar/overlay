import cache from '../cache';
/**
 * @typedef {{ dependencyId: number }} DependencyIdResponse
 *
 * @typedef {{
 *   description: string,
 *   metric_type_id: number,
 *   name: string
 * }[]} ModelStructureResponse
 *
 * @typedef {{
 *   metrics: Record<number, {
 *     score: number,
 *     metric_type_id: number
 *   }>
 * }} OshDataResponse
 *
 * The scores received from @see OshDataResponse
 * There are names and scores also for `practices` and `features`.
 * A metric contains list of practices which contains list of features.
 *
 * The metric scores are from 0-1000, but divided by 10, then rounded to integer.
 *
 * Score between 1 to 29 (was 294) will be red.
 * Score between 30 (295) to 69 (694) will be orange.
 * Score above 70 (695) will be green.
 */

const getLevel = (score) => {
  if (score >= 70) return 'GOOD';
  if (score >= 30) return 'WARNING';
  return 'BAD';
};

const CACHE_KEY = 'debricked';

/** @returns {Promise<DependencyIdResponse>} */
const getDependencyId = (type, name) =>
  cache([CACHE_KEY, type, name], () => fetch(`https://debricked.com/select/get-dependency-id/${type}-${name}`).then((r) => r.json()));

const getModelStructure = () =>
  cache([CACHE_KEY, 'model'], async () => {
    /** @type {ModelStructureResponse} */
    const model = await fetch(`https://debricked.com/select/get-model-structure`).then((r) => r.json());

    const modelStructure = model.reduce((acc, { metric_type_id, ...rest }) => {
      acc[metric_type_id] = rest;
      return acc;
    }, /** @type {Record<number, Omit<ModelStructureResponse[number], 'metric_type_id'>>} */ ({}));

    return modelStructure;
  });

/** @returns {Promise<OshDataResponse>} */
const getOshData = (dependencyId) =>
  cache([CACHE_KEY, dependencyId], () => fetch(`https://debricked.com/select/get-osh-data/${dependencyId}`).then((r) => r.json()));

export default async ({ type, name }) => {
  const model = await getModelStructure();
  const { dependencyId } = await getDependencyId(type, name);
  const { metrics: packageMetrics } = await getOshData(dependencyId);

  let isBad = false;

  const badges = Object.values(packageMetrics).reduce((acc, { score, metric_type_id }) => {
    const { name, description } = model[metric_type_id];
    const roundedScore = Math.round(score / 10);
    const level = getLevel(roundedScore);
    if (level === 'BAD') isBad = true;
    acc[name] = {
      description,
      score: roundedScore,
      level,
    };
    return acc;
  }, {});

  return {
    isBad,
    badges,
  };
};
