export const urlParser = ({ pathname }) => {
  const [_empty, _part, packageName, packageVersion] = pathname.split('/');
  return {
    registry: 'pypi',
    packageName,
    packageVersion: packageVersion || undefined,
  };
};
