import { describe, it, expect } from '@jest/globals';
import { parseCommand } from './npm';

const packageResult = (p) => ({
  type: 'npm',
  version: undefined,
  endIndex: p.startIndex + p.name.length + (p.version ? p.version.length + 1 : 0),
  ...p,
});

/**
 * @param {string[]} strings
 * @param  {...string} values
 */
const cli = (strings, ...values) => {
  let command = strings[0];
  const positions = [];

  for (let i = 0; i < values.length; i++) {
    positions.push({ index: command.length, value: values[i] });
    command += values[i] + strings[i + 1];
  }

  return { command, positions };
};

describe('npm', () => {
  describe(parseCommand.name, () => {
    it.each(['', 'bla bla', 'npm install', 'npm install -g'])('should return empty array if no packages found', (command) => {
      expect(parseCommand(command)).toStrictEqual([]);
    });

    it('should return the right position for recurrent package name', () => {
      const { command, positions } = cli`npm install ${'n'}`;
      const expectedPackages = positions.map(({ index, value }) => packageResult({ name: value, startIndex: index }));

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    });

    it('should find multiple packages', () => {
      const { command, positions } = cli`npm install ${'n'} ${'babel'} ${'n'} @scoped/package@1.2.3`;
      const expectedPackages = [
        ...positions.map(({ index, value }) => packageResult({ name: value, startIndex: index })),
        packageResult({ name: '@scoped/package', version: '1.2.3', startIndex: 22 }),
      ];

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    });

    it('should find in multiple lines', () => {
      const { command, positions } = cli`
      npm install ${'react'}
      yarn add -D ${'jest'}
      `;
      const expectedPackages = positions.map(({ index, value }) => packageResult({ name: value, startIndex: index }));

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    });
  });
});
