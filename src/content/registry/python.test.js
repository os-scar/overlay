import { describe, expect, it } from '@jest/globals';
import { parseCommand } from './python';
import { cli } from './tests-utils';

const packageResult = (p) => ({
  type: 'pypi',
  version: undefined,
  endIndex: p.startIndex + p.name.length + (p.version ? p.version.length + 1 : 0),
  ...p,
});

describe(parseCommand.name, () => {
  const commands = [
    'install',
    'install -U',
    'install -Iv http://sourceforge.net/projects/mysql-python/files/mysql-python/1.2.2/MySQL-python-1.2.2.tar.gz/download',
    'install numpy‑1.9.2+mkl‑cp34‑none‑win_amd64.whl',
    'install MySQL_python==', // Although this is a valid package name, it's not a valid command
    'install -r requirements.txt',
  ];
  const createCommand = (packageManager) => commands.map((command) => `${packageManager} ${command}`);

  const commandsWithPackageManager = [createCommand('pip'), createCommand('pip3')].flat();

  it.each(['', 'bla bla', ...commandsWithPackageManager])(`should not find in '%s'`, (command) => {
    expect(parseCommand(command)).toStrictEqual([]);
  });

  it.each(['p', 'package-with-dashes', 'underscore_', 'lazr.enum', 'WiTh_Upper-cas5'])(`Should find special package name '%s'`, (name) => {
    const command = `pip install ${name}`;
    const expectedPackages = [packageResult({ name, startIndex: 12, endIndex: 12 + name.length })];

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });

  it('should return the right position for recurrent package name', () => {
    const { command, positions } = cli`pip install ${'pi'}`;
    const expectedPackages = positions.map(({ index, value }) => packageResult({ name: value, startIndex: index }));

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });

  it.each([
    ['multiple args with values', `pip install --global-option build_ext -t ../ pandas`, 45],
    ['special args with values', `pip install --global-option='-I/usr/local/include' pandas`, 51],
    ['argument with =', 'pip install --compiler=mingw32 pandas', 31],
    ['combined args with values and =', 'pip install --global-option build_ext --global-option --compiler=mingw32 pandas', 73],
    ['multiple spaces', 'pip  install  --no-clean   pandas', 27],
    ['option after package name', 'pip install pandas --no-clean', 12],

    ['multiple args with values', `pip3 install --global-option build_ext -t ../ pandas`, 46],
    ['special args with values', `pip3 install --global-option='-I/usr/local/include' pandas`, 52],
    ['argument with =', 'pip3 install --compiler=mingw32 pandas', 32],
    ['combined args with values and =', 'pip3 install --global-option build_ext --global-option --compiler=mingw32 pandas', 74],
    ['multiple spaces', 'pip3  install  --no-clean   pandas', 28],
    ['option after package name', 'pip3 install pandas --no-clean', 13],
  ])('should find package after %s', (_, command, startIndex) => {
    const expectedPackages = [packageResult({ name: 'pandas', startIndex, endIndex: startIndex + 'pandas'.length })];

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });

  it('should find multiple packages', () => {
    const { command, positions } = cli`pip install ${'requests'} ${'numpy'} ${'pandas'} MySQL_python==1.2.2`;
    const expectedPackages = [
      ...positions.map(({ index, value }) => packageResult({ name: value, startIndex: index })),
      packageResult({ name: 'MySQL_python', startIndex: 34, endIndex: 34 + 'MySQL_python==1.2.2'.length }),
    ];

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });

  it.each(['==10.9.2', '>=1.25', '<=1', '~=1.1.13', '>=1.2,<20', '!=2.1.5', '<10'])(
    'should range the package with the version part: %s',
    (version) => {
      const command = `pip install -U numpy${version}`;
      const expectedPackages = [
        packageResult({
          name: 'numpy',
          startIndex: 15,
          endIndex: 15 + 'numpy'.length + version.length,
        }),
      ];

      const packagePosition = parseCommand(command);

      expect(packagePosition).toStrictEqual(expectedPackages);
    }
  );

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
