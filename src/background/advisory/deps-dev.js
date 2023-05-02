import cache from '../cache';

/**
 * UI: https://deps.dev/npm/react
 * API: https://deps.dev/_/s/npm/p/react/v/
 *
 * @typedef {{
 *   version: {
 *     version: string,
 *     licenses: string[],
 *     links: {
 *       repo: string
 *     },
 *     projects: {
 *       stars: number,
 *       scorecardV2: {
 *         check: {
 *           name: string,
 *           score: number,
 *         }[],
 *         score: number
 *       }
 *     }[]
 *   }
 * }} DevDepsPackageResponse
 *
 * @typedef {{
 *   versions: {
 *     version: string
 *   }[]
 * }} DevDepVersionsResponse
 */

const CACHE_KEY = 'deps.dev';

/** @returns {Promise<DevDepsPackageResponse>} */
const getPackageDetails = (type, name, version = '') =>
  cache([CACHE_KEY, type, name, version], () =>
    fetch(`https://deps.dev/_/s/${type}/p/${encodeURIComponent(name)}/v/${encodeURIComponent(version)}`).then((r) => r.json())
  );
/** @returns {Promise<DevDepVersionsResponse>} */
export const getVersions = (type, name) =>
  cache([CACHE_KEY, type, name, 'versions'], () =>
    fetch(`https://deps.dev/_/s/${type}/p/${encodeURIComponent(name)}/versions`).then((r) => r.json())
  );

export default async ({ type, name }) => {
  const details = await getPackageDetails(type, name);

  const { links, licenses, projects, version } = details.version;
  const project = projects.length ? projects[0] : null;

  const metrics = project?.scorecardV2.check.reduce((acc, { name, score }) => {
    acc[name] = score;
    return acc;
  }, /** @type {Record<string, number>} */ ({}));

  return {
    issues: 0,
    summary: `Score: ${project?.scorecardV2.score}/10`,
    reportUrl: `https://deps.dev/${type}/${name}`,
    data: {
      latestVersion: version,
      repo: links.repo,
      licenses,
      scorecard: {
        score: project?.scorecardV2.score,
        metrics,
      },
      stars: project?.stars,
    },
  };
};
