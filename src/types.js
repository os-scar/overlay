/**
 * @typedef {'npm' | 'pypi'} Registry
 *
 * @typedef {{
 *   type: Registry,
 *   name: string,
 *   version?: string
 * }} PackageID
 *
 * @typedef { PackageID & { range: Range }} ElementFindings
 *
 * @typedef {'BAD' | 'WARNING' | 'GOOD'} Level
 */
