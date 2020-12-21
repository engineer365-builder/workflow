const scopeRE = /^@[\w-]+(\.)?[\w-]+\//
const pkPluginRE = exports.pkPluginRE = /^(@pkb\/|pk-|@[\w-]+(\.)?[\w-]+\/pk-)(cli-)?plugin-/
const pbOfficialRE = /^@pkb\//
const path = require('path')

const pkbOfficialPlugins = [
  'cli',
  'eslint',
  'react',
  'tslint'
]

exports.isPlugin = id => pkPluginRE.test(id)

exports.isOfficialPlugin = id => exports.isPlugin(id) && pbOfficialRE.test(id)

exports.toShortPluginId = id => id.replace(vuePluginRE, '')

exports.getAllPluginIdOfPackageJson = () => {
  const pkgJsonPath = path.join(process.cwd(), 'package.json')
  const deps = {}
  const plugins = []
  const pkg = require(pkgJsonPath)
  Object.assign(deps, pkg.devDependencies || {}, pkg.dependencies || {})
  Object.keys(deps).forEach(dep => {
    pkPluginRE.test(dep) && plugins.push(dep)
  })
  return plugins
}

exports.resolvePluginId = id => {
  if (pkPluginRE.test(id)) {
    return id
  }
  if (pkbOfficialPlugins.includes(id)) {
    return `@pkb/plugin-${id}`
  }

  if (id.charAt(0) === '@') {
    const scopeMatch = id.match(scopeRE)
    if (scopeMatch) {
      const scope = scopeMatch[0]
      const shortId = id.replace(scopeRE, '')
      let ii = ''
      if (/^(@pkb)/.test(id)) {
        ii = `${scope}${
          (scope === '@pkb/' ? '' : 'pk-')
        }cli-plugin-${shortId}`
      } else {
        ii = id
      }
      return ii
    }
  }

  return `pk-cli-plugin-${id}`
}

exports.matchesPluginId = (input, full) => {
  const short = full.replace(vuePluginRE, '')
  return (
    // input is full
    full === input ||
    // input is short without scope
    short === input ||
    // input is short with scope
    short === input.replace(scopeRE, '')
  )
}
