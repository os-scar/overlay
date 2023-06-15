const finishAllWords = (argsAndPackagesWords) => {
  let length = 0;
  while (argsAndPackagesWords.length > 0) {
    length += argsAndPackagesWords.shift().length + 1;
  }
  return length;
};

/**
 * @param {string} registryName `type` in result element
 * @param {(line: string) => RegExpMatchArray} getBaseCommandMatch get the base command match for a line (examples: `pip install`, `yarn add`)
 * @param {(word: string, argsAndPackagesWords?: string[]) => number} handleArgument add a length to the counter to move it to the next argument
 * @param {(word: string, argsAndPackagesWords?: string[]) => { packageName: string, packageVersion?: string, packagePart: string } | null } parsePackageWord parse a word to its package name and its whole part (includes the version)
 */
export const createParseCommand =
  (registryName, getBaseCommandMatch, handleArgument, parsePackageWord) =>
  (command = '') => {
    const packages = [];
    let counterIndex = 0;

    const lines = command.split('\n');
    while (lines.length > 0) {
      const line = lines.shift();

      const baseCommandMatch = getBaseCommandMatch(line);
      if (!baseCommandMatch) {
        counterIndex += line.length + 1; // +1 for the newline
        continue;
      }

      const baseCommandLength = baseCommandMatch.index + baseCommandMatch[0].length;
      counterIndex += baseCommandLength;
      const argsAndPackagesWords = line.slice(baseCommandLength).split(' ');

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

        if (word.startsWith('#') || word.startsWith('//') || word.startsWith('(')) {
          counterIndex += word.length + 1 + finishAllWords(argsAndPackagesWords);
          continue;
        }

        const packageMatch = parsePackageWord(word, argsAndPackagesWords);
        if (!packageMatch) {
          counterIndex += word.length + 1;
          continue;
        }

        const startIndex = command.indexOf(packageMatch.packagePart, counterIndex);
        packages.push({
          type: registryName,
          name: packageMatch.packageName,
          version: packageMatch.packageVersion,
          startIndex,
          length: packageMatch.packagePart.length,
        });

        counterIndex += word.length + 1;
      }
    }

    return packages;
  };
