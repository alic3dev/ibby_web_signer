import Module from 'node:module'

const module_prototype_require: NodeJS.Module['require'] =
  Module.prototype.require
Module.prototype.require = function (
  id: Parameters<NodeJS.Module['require']>[0],
): ReturnType<NodeJS.Module['require']> {
  return module_prototype_require.call(
    this,
    id.startsWith('@/') ? `${__dirname}/${id.slice(2)}` : id,
  )
}
