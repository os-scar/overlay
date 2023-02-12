const npmInstall = /(npm|yarn)( -g)?( global)? (install|i|add|update)/;
const args = /( -[-\w]+)*/;
const npmAndArgs = `(?<commandWords>${npmInstall.source}${args.source})`;
const packageName = /(?<package_name>[a-z0-9_@][a-z0-9_./-]*)/;
const packageVersion = /@(?<package_version>[~^]?\d+(\.\d+){0,2}(-[a-z0-9_-]+)?)/;
const packageLabel = /@[a-z0-9_-]+/;
const fullPackage = new RegExp(String.raw`${packageName.source}(${packageVersion.source}|${packageLabel.source})?`);
const repeatedPackages = `(?<packages>( ${fullPackage.source}\\b)+)`;
const whiteSpace = / +/;

const NPM_COMMAND_REGEX = new RegExp(`${npmAndArgs}${repeatedPackages}`.replaceAll(' ', whiteSpace.source), 'g');

/** @param {string} str */
const parsePackageString = (str) => {
  const match = str.match(fullPackage);
  return (
    match && {
      type: 'npm',
      name: match.groups.package_name,
      version: match.groups.package_version,
    }
  );
};

export const parseCommand = (command = '') => {
  const matches = Array.from(command.matchAll(NPM_COMMAND_REGEX));

  const results = matches?.flatMap((match) => {
    const commandPart = match?.groups.commandWords;
    let currentIndex = match.index + commandPart?.length;
    const packagesPart = match?.groups.packages;
    if (!packagesPart) return [];

    const packages = packagesPart.split(' ');
    /** @type { (PackageID & { startIndex: number, endIndex: number })[]} */
    let packagesInfo = [];
    packages.forEach((packageStr) => {
      const startIndex = command.indexOf(packageStr, currentIndex);
      const endIndex = startIndex + packageStr.length;

      const info = parsePackageString(packageStr);
      if (info) packagesInfo.push({ ...info, startIndex, endIndex });

      currentIndex = endIndex;
    });

    return packagesInfo;
  });

  return results;
};

/** @param {URL} param0 */
export const urlParser = ({ pathname }) => {
  if (!pathname.startsWith('/package/')) return;
  const [name, version] = pathname.replace('/package/', '').split('/v/');

  return {
    type: 'npm',
    name,
    version: version || undefined,
  };
};
