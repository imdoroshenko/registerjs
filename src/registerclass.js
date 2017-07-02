const RegisterClass = function RegisterClass(func, injections, globalInjections) {
  this._func = func
  this._ownInjections = injections || {}
  this._globalInjections = globalInjections || {}
  this._instantiate = {}
  this._args = this.extractArgs(this._func.toString())
  this._argsLn = this._args.length
}
RegisterClass.prototype = {
  /*
   * https://stackoverflow.com/a/9924463
   * */
  ARGUMENT_NAMES: /([^\s,]+)/g,
  STRIP_COMMENTS: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg,
  global: global,
  undefined: void 0,
  'static': RegisterClass,
  extractArgs: function(source){
    source = source.replace(this.STRIP_COMMENTS, '')
    let result = source
      .slice(source.indexOf('(')+1, source.indexOf(')'))
      .match(this.ARGUMENT_NAMES)
    return (result === null ? [] : result).map(name => {
      if (name.indexOf('$$') === 0) {
        name = name.substr(2)
        this._instantiate[name] = true
      } else if (name.indexOf('$') === 0) {
        name = name.substr(1)
      } else {
        name = null
      }
      return name
    })
  },
  getInstance: function(args){
    return new (this.getConstructor(args))
  },
  getType: function(){
    return this._func
  },
  getConstructor : function(args, ctx){
    let injections = this.extractInjections()
    for(let i = 0, ai = 0, aln = args? args.length : 0; ai < aln; i++){
      if(injections[i] === this.undefined) {
        injections[i] = args[ai++]
      }
    }
    injections.unshift(ctx||null)
    return (Function.prototype.bind.apply(this._func, injections))
  },
  _extract : function(str){
    try {
      let target = this.global
      str.split('.').forEach(scope => target = target[scope])
      return target
    } catch (e) {
      return this.undefined
    }
  },
  _emptyArray: [],
  _createDIContainer: function (rgClass) {
    return function DIContainer() {
      return this.constructor === DIContainer
        ? new (rgClass.getConstructor(arguments))
        : (rgClass.getConstructor(arguments, this)).call(this)
    }
  },
  extractInjections: function(){
    let extractedInjections = []
    for(let i = 0; i < this._argsLn; i++){
      let
        name = this._args[i],
        entity = name
          ? (this._ownInjections[name] || this._globalInjections[name] || this._extract(name) || null)
          : this.undefined
      if(entity && entity.static === this.static) {
        if (this._instantiate[name]) {
          entity = entity.getInstance()
        } else {
          entity = this._createDIContainer(entity)
        }
      }
      extractedInjections.push(entity)
    }
    return extractedInjections
  }
}

module.exports = RegisterClass
