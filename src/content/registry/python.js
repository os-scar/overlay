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

const pipOptionsWithArg = [
  '-c',
  '--constraint',
  '-e',
  '--editable',
  '-t',
  '--target',
  '--platform',
  '--python-version',
  '--implementation',
  '--abi',
  '--root',
  '--prefix',
  '-b',
  '--build',
  '--src',
  '--upgrade-strategy',
  '--install-option',
  '--global-option',
  '--no-binary',
  '--only-binary',
  '--progress-bar',
  '-i',
  '--index-url',
  '--extra-index-url',
  '-f',
  '--find-links',
  '--log',
  '--proxy',
  '--retires',
  '--timeout',
  '--exists-action',
  '--trusted-host',
  '--cert',
  '--client-cert',
  '--cache-dir',
];
const optionWithArgRegex = `( (${pipOptionsWithArg.join('|')})(=| )\\S+)*`;
const options = /( -[-\w=]+)*/;
const packageArea = /["']?(?<package_part>(?<package_name>\w[\w.-]*)([=<>~!]=[\w.,<>]+)?)["']?(?=\s|$)/g;
const repeatedPackages = `(?<packages>( ${packageArea.source})+)`;
const whiteSpace = / +/;
const PIP_COMMAND_REGEX = new RegExp(
  `(?<command>pip install${optionWithArgRegex}${options.source})${repeatedPackages}`.replaceAll(' ', whiteSpace.source),
  'g'
);
export const parseCommand = (command) => {
  const matches = Array.from(command.matchAll(PIP_COMMAND_REGEX));

  const results = matches.flatMap((match) => {
    const packagesStr = match?.groups.packages;
    if (!packagesStr) return [];

    const packagesIndex = command.indexOf(packagesStr, match.index + match.groups.command.length);

    return Array.from(packagesStr.matchAll(packageArea))
      .map((packageMatch) => {
        const packagePart = packageMatch.groups.package_part;
        const name = packageMatch.groups.package_name;

        const startIndex = packagesIndex + packagesStr.indexOf(packagePart, packageMatch.index);
        const endIndex = startIndex + packagePart.length;

        return {
          type: 'pypi',
          name,
          version: undefined,
          startIndex,
          endIndex,
        };
      })
      .filter((result) => result.name !== 'requirements.txt');
  });

  return results;
};
