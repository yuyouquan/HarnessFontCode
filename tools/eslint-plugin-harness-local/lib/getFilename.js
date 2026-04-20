/**
 * ESLint 8/9 compatible filename accessor.
 * - ESLint 8: context.getFilename()
 * - ESLint 9: context.filename (property)
 * Returns a path with forward slashes for cross-platform regex matching.
 */
module.exports = function getFilename(context) {
  const raw = (typeof context.filename === 'string')
    ? context.filename
    : context.getFilename()
  return raw.replace(/\\/g, '/')
}
