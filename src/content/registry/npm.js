import { createParseCommand } from './shared';

const npmInstall = /((npm|yarn)( -g)?( global)? (install|i|add|update)) /;
const npxInstall = /(npx)\b/;
const npmExec = /npm exec/;
const npmCreate = /((npm|yarn) (init|create)) /;
const packageName = /(?<package_name>[a-z0-9_@][a-z0-9_./-]*)/;
const packageVersion = /@(?<package_version>[~^]?\d+(\.(\d|X|x)+){0,2}(-[a-z0-9_-]+)?)/;
const packageLabel = /@[a-z0-9_-]+/;
const fullPackage = new RegExp(String.raw`^${packageName.source}(${packageVersion.source}|${packageLabel.source})?$`);

// npm
const parsePackageString = (str) => {
  const match = str.match(fullPackage);
  if (!match) return null;
  return {
    packageName: match.groups.package_name,
    packageVersion: match.groups.package_version,
    packagePart: str,
  };
};

const npmOptionWithArgToIgnore = ['--network-timeout', '--network-concurrency'];

//npm
const handleArgument = (argument, restCommandWords) => {
  let index = 0;
  index += argument.length + 1; // +1 for the space removed by split

  if (!npmOptionWithArgToIgnore.includes(argument)) {
    return index;
  }

  if (argument.includes('=')) return index;

  index += restCommandWords.shift().length + 1;
  return index;
};

const parseNpmCommand = createParseCommand('npm', (line) => line.match(npmInstall), handleArgument, parsePackageString);

// npx
const parseOnlyFirstPackage = (str, argsAndPackagesWords) => {
  argsAndPackagesWords.splice(0, argsAndPackagesWords.length);

  return parsePackageString(str);
};

const handleNpxArgumentForPackage = (arg, argsAndPackagesWords) => {
  const packageArg = '--package=';
  if (arg.startsWith(packageArg)) {
    argsAndPackagesWords.unshift(arg.slice(packageArg.length));
    return packageArg.length;
  }
  return arg.length + 1;
};

const parseNpxCommand = createParseCommand(
  'npm',
  (line) => line.match(npxInstall) || line.match(npmExec),
  handleNpxArgumentForPackage,
  parseOnlyFirstPackage
);

// create-*, @scope/create
const parseCreatePackageString = (str, argsAndPackagesWords) => {
  argsAndPackagesWords.splice(0, argsAndPackagesWords.length);

  const match = str.match(packageName);
  if (!match) return null;

  const nameWithCreate = match.groups.package_name.startsWith('@')
    ? match.groups.package_name + '/create'
    : 'create-' + match.groups.package_name;

  return {
    packageName: nameWithCreate,
    packageVersion: match.groups.package_version,
    packagePart: str,
  };
};

const parseCreateCommand = createParseCommand(
  'npm',
  (line) => line.match(npmCreate),
  (word) => word.length + 1,
  parseCreatePackageString
);

export const parseCommands = [parseNpmCommand, parseNpxCommand, parseCreateCommand];

// URL
const urlParser = ({ pathname }) => {
  if (!pathname.startsWith('/package/')) return;
  const [name, version] = pathname.replace('/package/', '').split('/v/');

  return {
    type: 'npm',
    name,
    version: version || undefined,
  };
};

export const urlParsers = {
  'npmjs.com': urlParser,
  'npmjs.org': urlParser,
};
