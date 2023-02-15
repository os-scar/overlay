import { mountContentScript } from './content';
import { getPackageInfo } from './content/bridge';
import { urlParser } from './content/registry/npm';

mountContentScript(async () => {
  const { registry, packageName, packageVersion } = urlParser(window.location);
  const { id, depsDev, totalScore } = await getPackageInfo({ type: registry, name: packageName, version: packageVersion });

  const div = document.createElement('div');
  div.innerHTML = `
  <h3>overlay</h3>
  <p>${id.name}: ${depsDev.licenses[0]} Stars: ${depsDev.stars} Scorecard: ${depsDev.scorecard} Total Score: ${totalScore}</p>
  `;

  const cubic = document.getElementById('repository')?.parentElement;
  cubic?.parentElement?.insertBefore(div, cubic.nextSibling);
});
