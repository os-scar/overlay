/**
 * @typedef {{
 *   starRating: number,
 *   starRatingCount: number,
 *   badges: {
 *     nodes: {
 *       name: string,
 *       urlSlug: string,
 *       isPositive: boolean,
 *       voteCount: number
 *     }[]
 *   }
 * }} OpenbasePackageResponse
 *
 * There are 12 badges, 6 good and 6 bad.
 * Openbase will show the highest 5 badges, no matter if they are bad or good,
 * And even if they are the opposite of each other.
 */

import cache from '../cache';

const query = `
query GetOverviewPageFeedbackBreakdownPackage($packageName: String!, $packageLang: PackageLang!) {
    package(lang: $packageLang, name: $packageName) {
      starRating,
      starRatingCount,
      ...FeedbackBreakdown
    }
  }
  
  fragment FeedbackBreakdown on Package {
    rowId
    badges {
      nodes {
        name
        urlSlug
        isPositive
        voteCount
      }
    }
  }
`;

const getOpenbasePackage = (packageName, packageLang) =>
  cache(
    ['openbase', packageLang, packageName],
    /** @returns {Promise<OpenbasePackageResponse>} */
    async () => {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const graphql = JSON.stringify({
        query,
        variables: { packageName, packageLang },
      });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
      };

      return fetch('https://openbase.com/graphql', requestOptions)
        .then((r) => r.json())
        .then((r) => r.data.package);
    }
  );

const typeMap = {
  npm: 'JS',
};

export default async ({ type, name }) => {
  const { starRating, starRatingCount, badges } = await getOpenbasePackage(name, typeMap[type]);
  const top5badges = badges.nodes.sort((a, b) => b.voteCount - a.voteCount).slice(0, 5);
  const isBad = top5badges.some(({ isPositive }) => !isPositive);

  return {
    isBad,
    starRating,
    starRatingCount,
    badges: top5badges,
  };
};
