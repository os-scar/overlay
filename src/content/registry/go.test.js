import { describe, expect, it } from '@jest/globals';
import { parseCommand } from './go';

const positionInCommand = (command, packageName) => {
  const startIndex = command.indexOf(packageName);
  return { name: packageName, startIndex, endIndex: startIndex + packageName.length };
};

describe(parseCommand.name, () => {
  it.each([
    undefined,
    '',
    'just a text',
    'go get',
    'go get -u',
    'go get -u -v',
    'go get https://github.com/user/package',
    'go get code.google.com/p/goauth2/oauth',
  ])(`should not find a package in '%s'`, (text) => {
    expect(parseCommand(text)).toStrictEqual([]);
  });

  it.each(['github.com/user/package'])(`should find the package %s`, (packageName) => {
    const command = `go get ${packageName}`;
    const expectedPackages = [positionInCommand(command, packageName)];

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });

  it.each([
    ['go get', 'go get github.com/user/package'],
    ['with flag', 'go get -u github.com/user/package'],
    ['go install', 'go install github.com/user/package'],
    ['with branch', 'go get github.com/user/package@master'],
    ['with version', 'go get github.com/user/package@v1.12.0'],
    ['with commit hash', 'go get github.com/user/package@b2bd9c3'],
  ])(`should find the package in command with '%s'`, (_, command) => {
    const expectedPackages = [positionInCommand(command, 'github.com/user/package')];

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });

  it('should find multiple packages', () => {
    const command = 'go get github.com/google/uuid github.com/nu7hatch/gouuid';
    const expectedPackages = [
      positionInCommand(command, 'github.com/google/uuid'),
      positionInCommand(command, 'github.com/nu7hatch/gouuid'),
    ];

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });

  it('should find in multiline', () => {
    const command = `
      go get github.com/google/uuid
      go get github.com/nu7hatch/gouuid
    `;
    const expectedPackages = [
      positionInCommand(command, 'github.com/google/uuid'),
      positionInCommand(command, 'github.com/nu7hatch/gouuid'),
    ];

    const packagePosition = parseCommand(command);

    expect(packagePosition).toStrictEqual(expectedPackages);
  });
});
