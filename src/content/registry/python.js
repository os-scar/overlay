export const urlParser = ({ pathname }) => {
  const [_empty, _part, name, version] = pathname.split('/');
  return {
    type: 'pypi',
    name: name,
    version: version || undefined,
  };
};
