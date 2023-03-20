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

const PIP_COMMAND_REGEX = /pip install( -[-\w]+)* ["']?(?<package_name>\w[\w-]*)([=<>]=[\w.,<>]+)?["']?/g;

export const parseCommand = (command) => {
  const matches = Array.from(command.matchAll(PIP_COMMAND_REGEX));

  const results = matches?.map((match) => {
    const packageStr = match?.groups.package_name;
    const startIndex = command.indexOf(packageStr, match.index);
    const endIndex = startIndex + packageStr.length;

    return {
      type: 'pypi',
      name: packageStr,
      version: undefined,
      startIndex,
      endIndex,
    };
  });

  return results;
};
