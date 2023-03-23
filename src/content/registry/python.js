const registryParser = ({ pathname }) => {
  const [_empty, _part, name, version] = pathname.split('/');
  return {
    type: 'pypi',
    name,
    version: version || undefined,
  };
};

const docsParser = ({ pathname }) => {
  const [_empty, name] = pathname.split('/');
  return {
    type: 'pypi',
    name,
    version: undefined,
  };
};

export const urlParsers = {
  'pypi.org': registryParser,
  'pypi.python.org': registryParser,
  'packages.python.org': docsParser,
  'pythonhosted.org': docsParser,
};

const pipOptionsWithArgToIgnore = [
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

const packageArea = /(?<=\s|^)["']?(?<package_part>(?<package_name>\w[\w.-]*)([=<>~!]=?[\w.,<>]+)?)["']?(?=\s|$)/;

const handleArgument = (argument, restCommandWords) => {
  let index = 0;
  index += argument.length + 1; // +1 for the space removed by split

  if (argument === '-r' || argument === '--requirement') {
    while (restCommandWords.length > 0) {
      index += restCommandWords.shift().length + 1;
    }
    return index;
  }

  if (!pipOptionsWithArgToIgnore.includes(argument)) {
    return index;
  }

  if (argument.includes('=')) return index;

  index += restCommandWords.shift().length + 1;
  return index;
};

export const parseCommand = (command) => {
  const packages = [];
  let counterIndex = 0;

  const lines = command.split('\n');
  while (lines.length > 0) {
    const line = lines.shift();

    const pipInstallMatch = line.match(/pip +install/);
    if (!pipInstallMatch) {
      counterIndex += line.length + 1; // +1 for the newline
      continue;
    }

    const pipInstallLength = pipInstallMatch.index + pipInstallMatch[0].length;
    const argsAndPackagesWords = line.slice(pipInstallLength).split(' ');
    counterIndex += pipInstallLength;

    while (argsAndPackagesWords.length > 0) {
      const word = argsAndPackagesWords.shift();

      if (!word) {
        counterIndex++;
        continue;
      }

      if (word.startsWith('-')) {
        counterIndex += handleArgument(word, argsAndPackagesWords);
        continue;
      }

      const packageMatch = word.match(packageArea);
      if (!packageMatch) {
        counterIndex += word.length + 1;
        continue;
      }

      const startIndex = command.indexOf(packageMatch.groups.package_part, counterIndex);
      packages.push({
        type: 'pypi',
        name: packageMatch.groups.package_name,
        version: undefined,
        startIndex,
        endIndex: startIndex + packageMatch.groups.package_part.length,
      });

      counterIndex += word.length + 1;
    }
  }

  return packages;
};
