import Module from 'node:module'

const module_prototype_require: NodeJS.Require = Module.prototype.require
// @ts-expect-error overriding_prototype_but_calling_on_original_module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Module.prototype.require = function (id: string): any {
  return module_prototype_require.call(
    this,
    id.startsWith('@/') ? `${__dirname}/${id.slice(2)}` : id,
  )
}
