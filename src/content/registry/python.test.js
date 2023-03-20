import { describe, expect, it } from '@jest/globals';
import { parseCommand } from './python';

const packageResult = (p) => ({
  type: 'python',
  version: undefined,
  endIndex: p.startIndex + p.name.length + (p.version ? p.version.length + 1 : 0),
  ...p,
});

const cli = (strings, ...values) => {
  let command = strings[0];
  const positions = [];

  for (let i = 0; i < values.length; i++) {
    positions.push({ index: command.length, value: values[i] });
    command += values[i] + strings[i + 1];
  }

  return { command, positions };
};

describe('python', () => {
  describe(parseCommand.name, () => {
    it.each(['', 'bla bla', 'pip install', 'pip install -U'])('should return empty array if no packages found', (command) => {
      expect(parseCommand(command)).toStrictEqual([]);
    });

    it('should return the right position for recurrent package name', () => {
      const { command, positions } = cli`pip install ${'pandas'}`;
      const expectedPackages = positions.map(({ index, value }) => packageResult({ name: value, startIndex: index }));

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    });

    it('should find multiple packages', () => {
      const { command, positions } = cli`pip install ${'requests'} ${'numpy'} ${'pandas'} @scoped/package@1.2.3`;
      const expectedPackages = [
        ...positions.map(({ index, value }) => packageResult({ name: value, startIndex: index })),
        packageResult({ name: '@scoped/package', version: '1.2.3', startIndex: 22 }),
      ];

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    });

    it('should find in multiple lines', () => {
      const { command, positions } = cli`
      pip install ${'requests'}
      pip install -U ${'numpy'}
      `;
      const expectedPackages = positions.map(({ index, value }) => packageResult({ name: value, startIndex: index }));

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    });
  });
});
