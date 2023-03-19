export const addIndicator = async (range, packageID) => {
  console.debug('Adding indicator for', packageID);

  const indicator = document.createElement('overlay-indicator');
  indicator.setAttribute('overlay-indicator-package-type', packageID.type);
  indicator.setAttribute('overlay-indicator-package-name', packageID.name);
  indicator.appendChild(range.extractContents());
  range.insertNode(indicator);
};
