const
  ARGUMENT_NAMES = /([^\s,]+)/g,
  CONSTRUCT_ARGS = /constructor\s*\((.*)\)\s*\{/g,
  // https://stackoverflow.com/a/9924463
  STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg,
  IS_CLASS = /^class\s/,
  REQUEST_VALUE = '$',
  REQUEST_INSTANCE = '$$',
  PRIMITIVE = 'primitive',
  FUNCTION = 'function',
  CLASS = 'class',
  ARROW = 'arrow',
  AUTO = 'autp',
  REPOSITORY = new Map()

function register(name, entity, {wrap = true, type = AUTO} = {}) {
  if (arguments.length === 1) {
    return REPOSITORY.get(name)
  } else if (wrap === false) {
    return REPOSITORY.set(name, entity)
  } else {
    return REPOSITORY.set(name, container(entity, {type})).get(name)
  }
}

function getEntityType(entity) {
  let type = PRIMITIVE
  if (typeof entity === 'function') {
    if (entity.prototype === undefined) {
      type = ARROW
    } else if (IS_CLASS.test(entity.toString())) {
      type = CLASS
    } else {
      type = FUNCTION
    }
  }
  return type
}

function container(entity, {type = AUTO, dependencies = {}} = {}) {
  type = type === AUTO ? getEntityType(entity) : type
  switch (type) {
    case FUNCTION:
    case ARROW:
      return wrapFunction(entity, extractFuncArgs(entity))
    case CLASS:
      return wrapClass(entity, extractConstructArgs(entity))
      break
    default:
      return entity
  }

}

function getInjections(args) {
  let injections = []
  for (let i = 0, ln = args.length; i < ln; i++) {
    injections[i] = args[i] && REPOSITORY.has(args[i].get('name'))
      ? args[i].get('type') === REQUEST_INSTANCE ?  new (REPOSITORY.get(args[i].get('name'))) : REPOSITORY.get(args[i].get('name'))
      : null
  }
  return injections
}

function resolveArgs(injections, currentArgs) {
  for(let i = 0, ln = injections.length; i < ln; i++) {
    if (injections[i] !== null) {
      currentArgs.splice(i, 0, injections[i])
    }
  }
  return currentArgs
}

function wrapClass(func, diArgs) {
  return new Proxy(func, {
    construct(target, currentArgs, newTarget) {
      return Reflect.construct(target, resolveArgs(getInjections(diArgs), currentArgs))
    }
  })
}

function wrapFunction(func, diArgs) {
  return new Proxy(func, {
    apply(target, thisArg, currentArgs) {
      return target(...resolveArgs(getInjections(diArgs), currentArgs))
    },
    construct(target, currentArgs, newTarget) {
      return Reflect.construct(target, resolveArgs(getInjections(diArgs), currentArgs))
    }
  })
}

function parseArguments(name) {
  if (name.indexOf(REQUEST_INSTANCE) === 0) {
    name = new Map([['name', name.substr(2)], ['type', REQUEST_INSTANCE]])
  } else if (name.indexOf(REQUEST_VALUE) === 0) {
    name = new Map([['name', name.substr(1)], ['type', REQUEST_VALUE]])
  } else {
    name = null
  }
  return name
}

function extractConstructArgs(func) {
  let source = func.toString().replace(STRIP_COMMENTS, '').match(CONSTRUCT_ARGS)
  if (source === null) {
    return []
  } else {
    source = source[0]
    let args = source.slice(source.indexOf('(') + 1, source.indexOf(')')).match(ARGUMENT_NAMES)
    return (args === null ? [] : args).map(parseArguments)
  }
}

function extractFuncArgs(func) {
  let
    source = func.toString().replace(STRIP_COMMENTS, ''),
    args = source
    .slice(source.indexOf('(') + 1, source.indexOf(')'))
    .match(ARGUMENT_NAMES)
  return (args === null ? [] : args).map(parseArguments)
}

module.exports = {container, register}
