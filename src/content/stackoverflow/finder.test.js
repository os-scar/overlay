import { describe, expect, it } from '@jest/globals';
import { createCodeBlock, createPreCodeBlock, createRealAnswer, createRealComment } from '../../test-utils/html-builder';
import { findRanges } from './finder';

describe(findRanges.name, () => {
  describe('Links', () => {
    it.each([
      ['npm', 'simple', 'https://www.npmjs.com/package/minimist', 'minimist', undefined],
      ['npm', 'without www', 'https://npmjs.com/package/minimist', 'minimist', undefined],
      ['npm', 'with anchor', 'https://www.npmjs.com/package/node-sass#install', 'node-sass', undefined],
      ['npm', 'with version', 'https://www.npmjs.com/package/node-sass/v/4.11.0#install', 'node-sass', '4.11.0'],
      ['npm', 'scoped', 'https://www.npmjs.com/package/@babel/runtime/v/7.0.0-rc.4', '@babel/runtime', '7.0.0-rc.4'],
      ['npm', 'npm.org', 'https://www.npmjs.org/package/minimist', 'minimist', undefined],
      ['npm', 'npm.org without www', 'https://npmjs.org/package/minimist', 'minimist', undefined],

      ['pypi', 'python registry', 'https://pypi.python.org/pypi/dulwich', 'dulwich', undefined],
      ['pypi', 'python registry with version', 'https://pypi.python.org/pypi/dulwich/0.20.49/#installation', 'dulwich', '0.20.49'],

      ['pypi', 'pypi registry', 'https://pypi.org/project/numpy/', 'numpy', undefined],
      ['pypi', 'pypi registry with version', 'https://pypi.org/project/dulwich/0.20.49/#installation', 'dulwich', '0.20.49'],

      [
        'pypi',
        'pythonhosted',
        'https://pythonhosted.org/an_example_pypi_project/sphinx.html#full-code-example',
        'an_example_pypi_project',
        undefined,
      ],
      ['pypi', ' packages.python.org', 'http://packages.python.org/watchdog/', 'watchdog', undefined],
    ])('Should find "%s" link %s', (type, _, url, name, version) => {
      const { body } = createRealAnswer(`<a id="test" href="${url}">${name}</a>`);

      const foundElements = findRanges(body);

      expect(foundElements.length).toBe(1);
      const foundElement = foundElements[0];
      expect(foundElement).toStrictEqual({
        type,
        name,
        version,
        range: expect.any(Range),
      });
      const range = foundElement.range;
      expect(range.startContainer).toBe(range.endContainer);
      expect(range.toString()).toBe(name);
      // Test that the range includes the a element.
      // If the range includes only the text inside the a, it will be TextNode
      expect(range.startContainer.childNodes[range.startOffset].nodeType).not.toBe(Node.TEXT_NODE);
    });

    it.each(['http://npmjs.org/', 'https://pypi.python.org/packages/source/v/virtualenv/virtualenv-12.0.7.tar.gz'])(
      `Should not find any package in '%s'`,
      (url) => {
        const { body } = createRealAnswer(`<a id="test" href="${url}">test</a>`);

        const foundElements = findRanges(body);

        expect(foundElements.length).toBe(0);
      }
    );
  });

  describe('Commands', () => {
    const npmVariants = [
      'npm install <package_name>',
      'npm install -g <package_name>',
      'npm install -D <package_name>',
      'npm install <package_name> --save-dev',
      'npm install --save <package_name>',
      'npm i <package_name>',
      'npm i -g <package_name>',
      'npm i -D <package_name>',
      'npm i --save <package_name>',
      'npm i --save-dev <package_name>',
      'npm i <package_name> --save-dev',
      'npm update <package_name>',
      'npm exec <package_name>',
      'npm exec --package=<package_name> command',
    ];

    const npxVariants = ['npx <package_name>', 'npx -p <package_name> command', 'npx --package=<package_name> command'];

    const yarnVariants = [
      'yarn add <package_name>',
      'yarn add -D <package_name>',
      'yarn global add <package_name>',
      'yarn create <package_name> argument',
    ];

    const pipVariants = [
      'pip install <package_name>',
      'pip install --force-reinstall -v <package_name>',
      'pip install "<package_name>"',
      `pip install '<package_name>'`,
    ];

    it.each([
      ...npmVariants.map((cmd) => [cmd, 'npm']),
      ...yarnVariants.map((cmd) => [cmd, 'npm']),
      ...npxVariants.map((cmd) => [cmd, 'npm']),
      ...pipVariants.map((cmd) => [cmd, 'pypi']),
    ])(`'%s' inside <pre><code>`, (installCommand, type) => {
      const commandPackageName = 'my-package-name';

      const { body } = createPreCodeBlock(installCommand.replace('<package_name>', commandPackageName));

      const foundRanges = findRanges(body);

      expect(foundRanges.length).toBe(1);
      expect(foundRanges[0]).toStrictEqual({
        type,
        range: expect.any(Range),
        name: commandPackageName,
        version: undefined,
      });
      expect(foundRanges[0].range.toString()).toBe(commandPackageName);
    });

    it.each([
      ...npmVariants.map((cmd) => [cmd, 'npm']),
      ...yarnVariants.map((cmd) => [cmd, 'npm']),
      ...pipVariants.map((cmd) => [cmd, 'pypi']),
    ])(`'%s' inside <code>`, (installCommand, type) => {
      const commandPackageName = 'my-package-name';

      const { body } = createCodeBlock(installCommand.replace('<package_name>', commandPackageName));

      const foundElements = findRanges(body);

      expect(foundElements.length).toBe(1);
      expect(foundElements[0]).toStrictEqual({
        type,
        range: expect.any(Range),
        name: commandPackageName,
        version: undefined,
      });
      expect(foundElements[0].range.toString()).toBe(commandPackageName);
    });

    describe('npm', () => {
      it.each([
        ['', undefined],
        ['@12', '12'],
        ['@5.78', '5.78'],
        ['@123.5.45', '123.5.45'],
        ['@0.0.0-beta-0', '0.0.0-beta-0'],
        ['@^123.456.789', '^123.456.789'],
        ['@~5.5.5', '~5.5.5'],
        ['@latest', undefined],
        ['@4.X', '4.X'],
      ])(`Should find the version in format '%s'`, (installVersion, expectedVersion) => {
        const commandPackageName = 'my-package-name';

        const { body } = createCodeBlock(`npm i --save ${commandPackageName}${installVersion}`);

        const foundElements = findRanges(body);

        expect(foundElements.length).toBe(1);
        expect(foundElements[0]).toStrictEqual({
          type: 'npm',
          range: expect.any(Range),
          name: commandPackageName,
          version: expectedVersion,
        });
        expect(foundElements[0].range.toString()).toBe(commandPackageName + installVersion);
      });

      it.each(['n', '1', '@scope/package', 'package-with-dashes', 'underscore_', 'with.dot', '@scoped/with.all_tr1cks-'])(
        `Should find special package name '%s'`,
        (packageName) => {
          const installVersion = '1.2.3';

          const { body } = createCodeBlock(`npm i --save ${packageName}@${installVersion}`);

          const foundElements = findRanges(body);

          expect(foundElements.length).toBe(1);
          expect(foundElements[0]).toStrictEqual({
            type: 'npm',
            range: expect.any(Range),
            name: packageName,
            version: installVersion,
          });
          expect(foundElements[0].range.toString()).toBe(`${packageName}@${installVersion}`);
        }
      );

      it('Should find multiple packages', () => {
        const packages = ['babel-core', 'babel-polyfill', 'babel-preset-es2015', 'babel-preset-stage-0', 'babel-loader'];

        const { body } = createCodeBlock(`npm i -D ${packages.join(' ')}`);

        const foundElements = findRanges(body);

        expect(foundElements.length).toBe(packages.length);
        expect(foundElements).toStrictEqual(
          packages.map((name) => ({
            type: 'npm',
            range: expect.any(Range),
            name,
            version: undefined,
          }))
        );
        expect(foundElements.map(({ range }) => range.toString())).toEqual(packages);
      });

      it('Should find multiple packages in multiline <code>', () => {
        const package1 = 'test';
        const package2 = 'node-sass';
        const package3 = 'node-gyp';
        const { body } = createRealAnswer(`<pre class="lang-js s-code-block">
              <code class="hljs language-javascript">sudo npm install -g ${package1}
              sudo n <span class="hljs-number">0.12</span><span class="hljs-number">.7</span>
              npm install ${package2}@<span class="hljs-number">2</span>
              sudo npm -g install ${package3}@<span class="hljs-number">3</span>
              npm rebuild node-sass
              </code></pre>`);

        const foundElements = findRanges(body);

        expect(foundElements.length).toBe(3);
        expect(foundElements).toStrictEqual([
          {
            type: 'npm',
            range: expect.any(Range),
            name: package1,
            version: undefined,
          },
          {
            type: 'npm',
            range: expect.any(Range),
            name: package2,
            version: '2',
          },
          {
            type: 'npm',
            range: expect.any(Range),
            name: package3,
            version: '3',
          },
        ]);
        expect(foundElements[0].range.toString()).toBe(package1);
        expect(foundElements[1].range.toString()).toBe(`${package2}@2`);
        expect(foundElements[2].range.toString()).toBe(`${package3}@3`);
      });

      it('Should find package name with <span> inside', () => {
        const { body } = createRealAnswer(`
              <code class="hljs language-javascript">
                npm install --save-dev babel-plugin-transform-runtime
                npm install --save-dev babel-plugin-transform-<span class="hljs-keyword">async</span>-to-generator
              </code>
            `);

        const foundElements = findRanges(body);

        expect(foundElements.length).toBe(2);
        expect(foundElements).toStrictEqual([
          {
            type: 'npm',
            range: expect.any(Range),
            name: 'babel-plugin-transform-runtime',
            version: undefined,
          },
          {
            type: 'npm',
            range: expect.any(Range),
            name: 'babel-plugin-transform-async-to-generator',
            version: undefined,
          },
        ]);
        expect(foundElements[0].range.toString()).toBe('babel-plugin-transform-runtime');
        expect(foundElements[1].range.toString()).toBe('babel-plugin-transform-async-to-generator');
        expect(foundElements[1].range.cloneContents().querySelector('span').textContent).toBe('async');
      });

      it('Should return duplicate packages', () => {
        const { body } = createCodeBlock(`
              npm install -g npm@latest    // For the last stable version
              npm install -g npm@next
              npm install n@1
              npm install n@2
              `);

        const foundElements = findRanges(body);

        expect(foundElements.length).toBe(4);
        expect(foundElements).toStrictEqual([
          {
            type: 'npm',
            name: 'npm',
            version: undefined,
            range: expect.any(Range),
          },
          {
            type: 'npm',
            name: 'npm',
            version: undefined,
            range: expect.any(Range),
          },
          {
            type: 'npm',
            name: 'n',
            version: '1',
            range: expect.any(Range),
          },
          {
            type: 'npm',
            name: 'n',
            version: '2',
            range: expect.any(Range),
          },
        ]);
        expect(foundElements[0].range.toString()).toBe('npm@latest');
        expect(foundElements[1].range.toString()).toBe('npm@next');
        expect(foundElements[2].range.toString()).toBe('n@1');
        expect(foundElements[3].range.toString()).toBe('n@2');
      });
    });

    it.each([
      [
        'comment',
        'My entry into this arena is trepanjs (<a href="https://www.npmjs.com/package/trepanjs" rel="nofollow noreferrer">npmjs.com/package/trepanjs</a>). It has all of the goodness of the node debugger, but conforms better to gdb. It also has more features and commands like syntax highlighting, more extensive online help, and smarter evaluation. See <a href="https://github.com/rocky/trepanjs/wiki/Cool-things" rel="nofollow noreferrer">github.com/rocky/trepanjs/wiki/Cool-things</a> for some of its cool features.',
      ],
    ])('Should ignore packages in %s', (_reason, comment) => {
      const { body } = createRealComment(comment);

      const foundElements = findRanges(body);

      expect(foundElements.length).toBe(0);
    });

    it.each(['npm install -g', 'npm install PACKAGE-NAME', 'npm install packageName'])(`Should not find any package in '%s'`, (command) => {
      const { body } = createCodeBlock(command);

      const foundElements = findRanges(body);

      expect(foundElements.length).toBe(0);
    });

    // issue #37, #38
    it.each([
      'npm install git://github.com/user-c/dep-2#node0.8.0',
      'npm init react-app my-app', // create-react-app
      'npm exec create-react-app',
    ])(`Future support '%s`, (command) => {
      const { body } = createCodeBlock(command);

      const foundElements = findRanges(body);

      expect(foundElements.length).toBe(0);
    });
  });
});
