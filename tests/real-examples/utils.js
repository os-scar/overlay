/** @param {string} filename */
export const cleanupFilename = (filename) =>
  filename.replaceAll(/[^\w\d.]/g, '_').replaceAll('__', '_');
