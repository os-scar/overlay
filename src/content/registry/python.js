const registryParser = (pathname) => {
  const [_empty, _part, name, version] = pathname.split('/');
  return {
    type: 'pypi',
    name,
    version: version || undefined,
  };
};

const docsParser = (pathname) => {
  const [_empty, name] = pathname.split('/');
  return {
    type: 'pypi',
    name,
    version: undefined,
  };
};

export const urlParser = ({ hostname, pathname }) => {
  if (hostname.includes('pypi')) return registryParser(pathname);
  return docsParser(pathname);
};
