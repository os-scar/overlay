import { describe, expect, it } from '@jest/globals';
import { parseCommand } from './npm';
import { cli } from './tests-utils';

const packageResult = (p) => ({
  type: 'npm',
  version: undefined,
  length: p.name.length + (p.version ? p.version.length + 1 : 0),
  ...p,
});

describe('npm', () => {
  describe(parseCommand.name, () => {
    it.each([
      '',
      'bla bla',
      'npm install',
      'npm install -g',
      '`npm install node-sass`', // this is not a valid command because of the `
      'npm init react-app my-app', // not yet supported. #37
    ])('should return empty array if no packages found', (command) => {
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

    it('should range the package with the version part', () => {
      const command = 'yarn add -D react@^12.5.0';
      const expectedPackages = [
        packageResult({
          name: 'react',
          version: '^12.5.0',
          startIndex: 12,
          lenght: 'react@^12.5.0'.length,
        }),
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
