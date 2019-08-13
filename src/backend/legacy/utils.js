// @flow

import type { InternalInstance } from './renderer';

export function decorate(object: Object, attr: string, fn: Function): Function {
  const old = object[attr];
  object[attr] = function(instance: InternalInstance) {
    return fn.call(this, old, arguments);
  };
  return old;
}

export function decorateMany(
  source: Object,
  fns: { [attr: string]: Function }
): Object {
  const olds = {};
  for (const name in fns) {
    olds[name] = decorate(source, name, fns[name]);
  }
  return olds;
}

export function restoreMany(source: Object, olds: Object): void {
  for (let name in olds) {
    source[name] = olds[name];
  }
}

export function forceUpdate(instance: InternalInstance): void {
  if (typeof instance.forceUpdate === 'function') {
    instance.forceUpdate();
  } else if (
    instance.updater != null &&
    typeof instance.updater.enqueueForceUpdate === 'function'
  ) {
    instance.updater.enqueueForceUpdate(this, () => {}, 'forceUpdate');
  }
}
