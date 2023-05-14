import { jest } from '@jest/globals';
import fs from 'fs';
import { fetchLinks, getFilenameFromURL } from '../real-examples/fetch-snapshots';

const jsonResponses = {
  'https://deps.dev/_/s/npm/p/react/v/': {
    package: {
      system: 'NPM',
      name: 'react',
    },
    version: {
      version: '18.2.0',
      licenses: ['MIT'],
      links: {
        origins: ['https://www.npmjs.com/package/react/v/18.2.0'],
        homepage: 'https://reactjs.org/',
        issues: 'https://github.com/facebook/react/issues',
        repo: 'https://github.com/facebook/react',
      },
      projects: [
        {
          stars: 199871,
          scorecardV2: {
            date: '2022-11-21',
            score: 6.1,
            check: [
              {
                name: 'Code-Review',
                documentation: {
                  short: 'Determines if the project requires code review before pull requests (aka merge requests) are merged.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#code-review',
                },
                score: 8,
                reason: '21 out of last 24 changesets reviewed before merge -- score normalized to 8',
                details: [],
              },
              {
                name: 'Maintained',
                documentation: {
                  short: 'Determines if the project is "actively maintained".',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#maintained',
                },
                score: 10,
                reason: '30 commit(s) out of 30 and 6 issue activity out of 30 found in the last 90 days -- score normalized to 10',
                details: [],
              },
              {
                name: 'Vulnerabilities',
                documentation: {
                  short: 'Determines if the project has open, known unfixed vulnerabilities.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#vulnerabilities',
                },
                score: 10,
                reason: 'no vulnerabilities detected',
                details: [],
              },
              {
                name: 'CII-Best-Practices',
                documentation: {
                  short: 'Determines if the project has an OpenSSF (formerly CII) Best Practices Badge.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#cii-best-practices',
                },
                score: 2,
                reason: 'badge detected: in_progress',
                details: [],
              },
              {
                name: 'Signed-Releases',
                documentation: {
                  short: 'Determines if the project cryptographically signs release artifacts.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#signed-releases',
                },
                score: 0,
                reason: '0 out of 3 artifacts are signed or have provenance',
                details: [
                  'Warn: release artifact v16.6.3 does not have provenance: https://api.github.com/repos/facebook/react/releases/13984567',
                  'Warn: release artifact v16.6.3 not signed: https://api.github.com/repos/facebook/react/releases/13984567',
                  'Warn: release artifact v16.6.1 does not have provenance: https://api.github.com/repos/facebook/react/releases/13867150',
                  'Warn: release artifact v16.6.1 not signed: https://api.github.com/repos/facebook/react/releases/13867150',
                  'Warn: release artifact v16.6.0 does not have provenance: https://api.github.com/repos/facebook/react/releases/13620514',
                  'Warn: release artifact v16.6.0 not signed: https://api.github.com/repos/facebook/react/releases/13620514',
                ],
              },
              {
                name: 'Packaging',
                documentation: {
                  short:
                    'Determines if the project is published as a package that others can easily download, install, easily update, and uninstall.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#packaging',
                },
                score: -1,
                reason: 'no published package detected',
                details: ['Warn: no GitHub publishing workflow detected'],
              },
              {
                name: 'Dangerous-Workflow',
                documentation: {
                  short: "Determines if the project's GitHub Action workflows avoid dangerous patterns.",
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#dangerous-workflow',
                },
                score: 10,
                reason: 'no dangerous workflow patterns detected',
                details: [],
              },
              {
                name: 'Security-Policy',
                documentation: {
                  short: 'Determines if the project has published a security policy.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#security-policy',
                },
                score: 10,
                reason: 'security policy file detected',
                details: [
                  'Info: Found linked content in security policy: SECURITY.md',
                  'Info: Found text in security policy: SECURITY.md',
                  'Info: Found disclosure, vulnerability, and/or timelines in security policy: SECURITY.md',
                  'Info: security policy detected in current repo: SECURITY.md',
                ],
              },
              {
                name: 'Token-Permissions',
                documentation: {
                  short: "Determines if the project's workflows follow the principle of least privilege.",
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#token-permissions',
                },
                score: 0,
                reason: 'non read-only tokens detected in GitHub workflows',
                details: [
                  'Warn: no topLevel permission defined: .github/workflows/commit_artifacts.yml:1: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/commit_artifacts.yml/main?enable=permissions',
                  'Warn: no topLevel permission defined: .github/workflows/devtools_check_repro.yml:1: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/devtools_check_repro.yml/main?enable=permissions',
                ],
              },
              {
                name: 'License',
                documentation: {
                  short: 'Determines if the project has defined a license.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#license',
                },
                score: 10,
                reason: 'license file detected',
                details: ['Info: : LICENSE:1'],
              },
              {
                name: 'Binary-Artifacts',
                documentation: {
                  short: 'Determines if the project has generated executable (binary) artifacts in the source repository.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#binary-artifacts',
                },
                score: 10,
                reason: 'no binaries found in the repo',
                details: [],
              },
              {
                name: 'Pinned-Dependencies',
                documentation: {
                  short: 'Determines if the project has declared and pinned the dependencies of its build process.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#pinned-dependencies',
                },
                score: 7,
                reason: 'dependency not pinned by hash detected -- score normalized to 7',
                details: [
                  'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/commit_artifacts.yml:11: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/commit_artifacts.yml/main?enable=pin',
                  'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/commit_artifacts.yml:17: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/commit_artifacts.yml/main?enable=pin',
                  'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/commit_artifacts.yml:107: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/commit_artifacts.yml/main?enable=pin',
                  'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/commit_artifacts.yml:116: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/commit_artifacts.yml/main?enable=pin',
                  'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/commit_artifacts.yml:121: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/commit_artifacts.yml/main?enable=pin',
                  'Warn: third-party GitHubAction not pinned by hash: .github/workflows/commit_artifacts.yml:127: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/commit_artifacts.yml/main?enable=pin',
                  'Warn: GitHub-owned GitHubAction not pinned by hash: .github/workflows/devtools_check_repro.yml:12: update your workflow using https://app.stepsecurity.io/secureworkflow/facebook/react/devtools_check_repro.yml/main?enable=pin',
                  'Warn: npmCommand not pinned by hash: .github/workflows/commit_artifacts.yml:16',
                  'Info: Dockerfile dependencies are pinned',
                  'Info: no insecure (not pinned by hash) dependency downloads found in Dockerfiles',
                  'Info: no insecure (not pinned by hash) dependency downloads found in shell scripts',
                ],
              },
              {
                name: 'Dependency-Update-Tool',
                documentation: {
                  short: 'Determines if the project uses a dependency update tool.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#dependency-update-tool',
                },
                score: 10,
                reason: 'update tool detected',
                details: ['Info: Dependabot detected'],
              },
              {
                name: 'SAST',
                documentation: {
                  short: 'Determines if the project uses static code analysis.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#sast',
                },
                score: 0,
                reason: 'SAST tool is not run on all commits -- score normalized to 0',
                details: ['Warn: 0 commits out of 30 are checked with a SAST tool', 'Warn: CodeQL tool not detected'],
              },
              {
                name: 'Branch-Protection',
                documentation: {
                  short: "Determines if the default and release branches are protected with GitHub's branch protection settings.",
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#branch-protection',
                },
                score: 1,
                reason: 'branch protection is not maximal on development and all release branches',
                details: [
                  "Info: 'force pushes' disabled on branch 'main'",
                  "Info: 'allow deletion' disabled on branch 'main'",
                  "Warn: no status checks found to merge onto branch 'main'",
                  "Warn: number of required reviewers is only 0 on branch 'main'",
                  "Warn: codeowner review is not required on branch 'main'",
                  "Warn: branch protection not enabled for branch '17.0.2'",
                  "Warn: branch protection not enabled for branch '17.0.1'",
                  "Warn: branch protection not enabled for branch '17.0.0-dev'",
                  "Warn: branch protection not enabled for branch 'old-majors'",
                  "Info: 'force pushes' disabled on branch '16.3-dev'",
                  "Info: 'allow deletion' disabled on branch '16.3-dev'",
                  "Warn: no status checks found to merge onto branch '16.3-dev'",
                  "Warn: number of required reviewers is only 0 on branch '16.3-dev'",
                  "Warn: codeowner review is not required on branch '16.3-dev'",
                ],
              },
              {
                name: 'Fuzzing',
                documentation: {
                  short: 'Determines if the project uses fuzzing.',
                  url: 'https://github.com/ossf/scorecard/blob/ef79b9487d8f8bf6fca7b0bafc8c55049d925403/docs/checks.md#fuzzing',
                },
                score: 0,
                reason: 'project is not fuzzed',
                details: [],
              },
            ],
          },
        },
      ],
    },
    defaultVersion: '18.2.0',
  },

  'https://socket.dev/api/npm/package-info/score?name=react': {
    score: {
      supplyChainRisk: {
        score: 0.957938984987372,
      },
      quality: {
        score: 0.8568166416706429,
      },
      maintenance: {
        score: 0.9935156587744616,
      },
      vulnerability: {
        score: 1,
      },
      license: {
        score: 0.8751229424500714,
      },
      miscellaneous: {
        score: 0,
      },
    },
  },

  'https://debricked.com/select/get-model-structure': [
    {
      description:
        'Open Source projects consists of contributors. When deciding what open source to bring in to your software, it is important to inspect and analyse the contributors of a project.',
      metric_type_id: 1,
      name: 'Contributors',
    },
    {
      description:
        'The popularity of a repository is a rather crucial indicator of the health of a project. It signifies interest from both developers and users alike,  pointing towards viability and continued development.',
      metric_type_id: 2,
      name: 'Popularity',
    },
    {
      description:
        'The security of a repository is important in many aspects of open source. This metric is impactful to the risk associated with an open source project, as it measures both indicators of vulnerability entry risk, and past vulnerability response performance. ',
      metric_type_id: 3,
      name: 'Security',
    },
  ],
  'https://debricked.com/select/get-dependency-id/npm-react': {
    dependencyId: 12022,
  },
  'https://debricked.com/select/get-osh-data/12022': {
    metrics: {
      1: {
        id: 19021499,
        updated_at: '2022-02-13T04:06:54',
        score: 716,
        metric_type_id: 1,
      },
      2: {
        id: 5659944,
        updated_at: '2022-02-13T03:57:24',
        score: 830,
        metric_type_id: 2,
      },
      3: {
        id: 32362092,
        updated_at: '2022-02-13T04:05:10',
        score: 852,
        metric_type_id: 3,
      },
    },
  },
};

const textResponses = fetchLinks.reduce((acc, url) => {
  acc[url] = fs.readFileSync(getFilenameFromURL(url), 'utf-8');
  return acc;
}, {});

global.fetch = jest.fn((url) =>
  Promise.resolve({
    json: () => Promise.resolve(jsonResponses[url]),
    text: () => Promise.resolve(textResponses[url]),
  })
);
