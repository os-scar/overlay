import { describe, expect, it } from '@jest/globals';
import { parseCommands } from './npm';
import { cli } from './tests-utils';

const parseCommand = (command) => parseCommands.flatMap((parser) => parser(command));

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
      'npm create-react-app my-app',
    ])('should return empty array if no packages found', (command) => {
      expect(parseCommand(command)).toStrictEqual([]);
    });

    it.each(['npm init <package_name> argument', 'npm create <package_name> argument', 'yarn create <package_name> argument'])(
      `'%s' find create-* package`,
      (template) => {
        const startIndex = template.indexOf('<package_name>');
        const endIndex = startIndex + 'react-app'.length;
        const command = template.replace('<package_name>', 'react-app');

        const packagePosition = parseCommand(command);

        expect(packagePosition).toStrictEqual([packageResult({ name: 'create-react-app', startIndex, endIndex })]);
      }
    );

    it.each(['npm init @scope', 'npm create @scope'])(`'%s' find @scope/create package`, (command) => {
      const startIndex = command.indexOf('@scope');
      const endIndex = startIndex + '@scope'.length;
      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual([packageResult({ name: '@scope/create', startIndex, endIndex })]);
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

    it.each(['yarn add -D <package>', 'npx <package> my-app'])('should range the package with the version part', (command) => {
      const name = 'create-react-app';
      const version = '^12.5.0';
      const packagePart = `${name}@${version}`;
      const startIndex = command.indexOf('<package>');
      const expectedPackages = [
        packageResult({
          name,
          version,
          startIndex,
          endIndex: startIndex + packagePart.length,
        }),
      ];

      const packagePosition = parseCommand(command.replace('<package>', packagePart));

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

    it('should find create-* in multiple lines', () => {
      const { command, positions } = cli`
      npx ${'create-react-app'} my-app
      npm init ${'react-app'} my-app
      yarn create ${'react-app'} my-app
      `;

      const expectedPackages = positions.map(({ index, value }) =>
        packageResult({
          name: 'create-react-app',
          startIndex: index,
          endIndex: index + value.length,
        })
      );

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    });
  });
});
