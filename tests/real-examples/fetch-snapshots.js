import { existsSync, promises as fs, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { cleanupFilename } from './utils.js';

const __dirname = fileURLToPath(dirname(import.meta.url));
const snapshotsDir = join(__dirname, 'snapshots', 'fetch');

export const getFilenameFromURL = (url) => join(snapshotsDir, cleanupFilename(url) + '.html');

export const fetchLinks = ['https://snyk.io/advisor/npm-package/react'];

const snapshotURL = async (url) => {
  const response = await fetch(url, { method: 'GET', redirect: 'follow' });
  const text = await response.text();
  await fs.writeFile(getFilenameFromURL(url), text, 'utf-8');
  console.log(`saved snapshot for ${url}`);
};

export const updateSnapshots = async (force = false) => {
  const existingSnapshots = existsSync(snapshotsDir) && readdirSync(snapshotsDir).length;
  if (!force && existingSnapshots) {
    console.log(`snapshot dir '${snapshotsDir} exists, not updating snapshots`);
    return;
  }

  if (existingSnapshots) await fs.rm(snapshotsDir, { recursive: true });
  await fs.mkdir(snapshotsDir, { recursive: true });

  await Promise.all(fetchLinks.map(snapshotURL));
};
