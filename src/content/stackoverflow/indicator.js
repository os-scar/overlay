import { indicatorTagName } from '../../globals';

export const addIndicator = async (range, packageID) => {
  console.debug('Adding indicator for', packageID);

  const indicator = document.createElement(indicatorTagName);
  indicator.setAttribute('package-type', packageID.type);
  indicator.setAttribute('package-name', packageID.name);
  indicator.appendChild(range.extractContents());
  range.insertNode(indicator);
};
