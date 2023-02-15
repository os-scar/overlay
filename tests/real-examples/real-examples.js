import { existsSync, promises as fs, readdirSync } from 'fs';
import yaml from 'js-yaml';
import fetch from 'node-fetch';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { cleanupFilename } from './utils.js';

const __dirname = fileURLToPath(dirname(import.meta.url));
const realExamplesFile = join(__dirname, 'real-examples.yaml');
const webpageSnapshotsFolder = join(__dirname, 'snapshots', 'webpages');
const realExamplesResults = join(__dirname, 'real-examples-results.yaml');

const webpageSnapshotFile = (example) =>
  join(webpageSnapshotsFolder, cleanupFilename(`${example.registry}_${example.comment}`).substring(0, 35) + '.html');

const loadExamples = async () => {
  const { links } = yaml.load(await fs.readFile(realExamplesFile));
  return Object.entries(links).map(([link, details]) => ({
    ...details,
    link,
  }));
};

export const readRealExamples = async () => {
  const links = await loadExamples();
  const asArray = links.map(async (details) => ({
    ...details,
    html: await fs.readFile(webpageSnapshotFile(details), 'utf-8'),
  }));
  return Promise.all(asArray);
};

const fetchWebpage = async (example) => {
  const response = await fetch(example.link);
  await fs.writeFile(webpageSnapshotFile(example), await response.text(), 'utf-8');
  console.log(`saved snapshot for ${example.link}`);
};

export const snapshotWebpages = async (force = false) => {
  const existingSnapshots = existsSync(webpageSnapshotsFolder) && readdirSync(webpageSnapshotsFolder).length;
  if (!force && existingSnapshots) {
    console.log(`snapshot dir '${webpageSnapshotsFolder} exists, not updating snapshots`);
    return;
  }

  if (existingSnapshots) await fs.rm(webpageSnapshotsFolder, { recursive: true });
  await fs.mkdir(webpageSnapshotsFolder, { recursive: true });

  const examples = await loadExamples();
  await Promise.all(examples.map(fetchWebpage));
};

export const writeResultsSnapshot = async (data) => {
  const yamlContent = yaml.dump(data);
  await fs.writeFile(realExamplesResults, yamlContent);
  return realExamplesResults;
};
