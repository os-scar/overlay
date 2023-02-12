import { expect } from '@jest/globals';
import { spawnSync } from 'child_process';

expect.extend({
  toBeChangedByGit(received) {
    const lsFilesOut = spawnSync('git', ['ls-files', received], { encoding: 'utf8' });
    const isNewFile = lsFilesOut.stdout.trim() === '';
    if (isNewFile)
      return {
        message: () =>
          `expected file "${received}" ${
            isChanged ? 'not ' : ''
          }to be changed by Git\n\nGit diff:\n${result.stdout}`,
        pass: false,
      };

    // Use the `git diff` command to check if the file has been modified
    const result = spawnSync('git', ['diff', '--color', received], { encoding: 'utf8' });

    // If the file has been modified, the `git diff` command will return a non-empty string
    const isChanged = result.stdout.trim() !== '';

    // Return the negated result of the matcher
    return {
      message: () =>
        `expected file "${received}" ${isChanged ? 'not ' : ''}to be changed by Git\n\nGit diff:\n${
          result.stdout
        }`,
      pass: isChanged,
    };
  },
});
