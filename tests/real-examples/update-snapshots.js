import { EOL } from 'os';
import * as fetchSnapshots from './fetch-snapshots.js';
import * as realExampleSnapshots from './real-examples.js';

export default async () => {
  console.log(EOL + 'restoring snapshots');
  await Promise.all([fetchSnapshots.updateSnapshots(false), realExampleSnapshots.snapshotWebpages(false)]);
  console.log('snapshot restored');
};
