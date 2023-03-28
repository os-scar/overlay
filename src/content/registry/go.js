export const parseCommand = (command = '') => {
  const packages = [];
  let counterIndex = 0;

  const lines = command.split('\n');
  while (lines.length > 0) {
    const line = lines.shift();

    const goGetMatch = line.match(/go +(get|install)/);
    if (!goGetMatch) {
      counterIndex += line.length + 1; // +1 for the newline
      continue;
    }

    const goGetLength = goGetMatch.index + goGetMatch[0].length;
    counterIndex += goGetLength;
    const argsAndPackagesWords = line.slice(goGetLength).split(' ');

    while (argsAndPackagesWords.length > 0) {
      const word = argsAndPackagesWords.shift();

      if (!word) {
        counterIndex++;
        continue;
      }

      if (word.startsWith('-')) {
        counterIndex += word.length + 1;
        continue;
      }

      const packageMatch = word.match(/^(?<name>\w[\w./]+)(@[\w.]+)?$/);
      if (!packageMatch) {
        counterIndex += word.length + 1;
        continue;
      }

      packages.push({
        type: 'go',
        name: packageMatch.groups.name,
        startIndex: counterIndex,
        endIndex: counterIndex + packageMatch[0].length,
      });

      counterIndex += word.length + 1;
    }
  }

  return packages;
};
