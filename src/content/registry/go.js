import { createParseCommand } from './shared';

const parsePackageWord = (word) => {
  const packageMatch = word.match(/^(?<name>github\.com(\/\w[\w.-]+){2})(\/[\w.-]+)*(@[\w.-]+)?$/);
  if (!packageMatch) return null;

  const { name } = packageMatch.groups;
  return {
    packageName: name,
    packagePart: packageMatch[0],
  };
};

export const parseCommand = createParseCommand(
  'go',
  (line) => line.match(/go +(get|install)/),
  (word) => word.length + 1,
  parsePackageWord
);
