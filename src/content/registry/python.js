import { createParseCommand } from './shared';

const registryParser = ({ pathname }) => {
  if (pathname.includes('/packages/source/v/')) return;

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

const packageArea = /^["']?(?<package_part>(?<package_name>\w[\w.-]*)([=<>~!]=?[\w.,<>]+)?)["']?$/;

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

const baseCommandMatch = (line) => line.match(/pip3? +install/);
const packageWordParse = (word) => {
  const match = word.match(packageArea);
  if (!match) return null;

  const { package_part, package_name } = match.groups;
  return {
    packagePart: package_part,
    packageName: package_name,
  };
};

export const parseCommand = createParseCommand('pypi', baseCommandMatch, handleArgument, packageWordParse);
