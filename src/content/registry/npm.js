import { createParseCommand } from './shared';

const npmInstall = /((npm|yarn)( -g)?( global)? (install|i|add|update))\s/;
const npmInit = /(npx|npm init)\b/;
const packageName = /(?<package_name>[a-z0-9_@][a-z0-9_./-]*)/;
const packageVersion = /@(?<package_version>[~^]?\d+(\.(\d|X|x)+){0,2}(-[a-z0-9_-]+)?)/;
const packageLabel = /@[a-z0-9_-]+/;
const fullPackage = new RegExp(String.raw`^${packageName.source}(${packageVersion.source}|${packageLabel.source})?$`);

const parsePackageString = (str, baseCommand, packagesLength) => {
  if ((baseCommand === 'npx' || baseCommand === 'npm init') && packagesLength > 0) {
    return null;
  }
  const match = str.match(fullPackage);
  if (!match) return null;
  return {
    packageName: match.groups.package_name,
    packageVersion: match.groups.package_version,
    packagePart: str,
  };
};

export const parseCommand = createParseCommand(
  'npm',
  (line) => line.match(npmInstall) || line.match(npmInit),
  (word) => word.length + 1,
  parsePackageString
);

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
