import { createParseCommand } from './shared';

const npmInstall = /((npm|yarn)( -g)?( global)? (install|i|add|update)) /;
const npxInstall = /(npx)\b/;
const npmExec = /npm exec/;
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

const parseNpmCommand = createParseCommand(
  'npm',
  (line) => line.match(npmInstall),
  (word) => word.length + 1,
  parsePackageString
);

// npx
const parseOnlyFirstPackage = (str, foundPackages) => {
  if (foundPackages > 0) {
    return null;
  }

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

export const parseCommands = [parseNpmCommand, parseNpxCommand];

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
