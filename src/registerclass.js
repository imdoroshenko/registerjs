const RegisterClass = function RegisterClass(func, injections, globalInjections){
  this.static = RegisterClass
  this._func = func
  this._ownInjections = injections||{}
  this._globalInjections = globalInjections||{}
  this._args = this.extractArgs(this._func.toString())
  this._argsLn = this._args.length
}
RegisterClass.prototype = {
  /*
   * thanks to angularjs team
   * */
  FN_ARGS : /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
  FN_ARG_SPLIT : /\s*,\s*/,
  FN_ARG : /^\s*(_?)(\S+?)\1\s*$/,
  STRIP_COMMENTS : /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
  global : global,
  undefined : void 0,
  extractArgs : function(source){
    let args = [],
      fnText = source.replace(this.STRIP_COMMENTS, ''),
      argDecl = fnText.match(this.FN_ARGS)
    argDecl && argDecl[1] && argDecl[1].split(this.FN_ARG_SPLIT).forEach(arg => {
      arg.replace(this.FN_ARG, function(all, underscore, name){
        args.push(name.indexOf('$') === 0
          ? name.substr(1)
          : null)
      })
    })
    return args
  },
  getInstance : function(args){
    return new (this.getConstructor(args))
  },
  getType : function(){
    return this._func
  },
  getConstructor : function(args, ctx){
    let injections = this.extractInjections()
    for(let i = 0; args && args[0]; i++){
      if(injections[i] === this.undefined){
        injections[i] = args.shift()
      }
    }
    return (Function.prototype.bind.apply(this._func, [ctx||null].concat(injections)))
  },
  _extract : function(str){
    try{
      let target = this.global
      str.split('.').forEach(scope => {
        target = target[scope]
      })
      return target
    } catch(e) {
      return undefined
    }
  },
  extractInjections : function(){
    let extractedInjections = []
    for(let i = 0, ln = this._args.length; i < ln; i++){
      let
        name = this._args[i],
        entity = name
          ? (this._ownInjections[name] || this._globalInjections[name] || this._extract(name) || null)
          : this.undefined
      if(entity && entity instanceof this.static){
        if (name[0].toUpperCase() === name[0]) {
          entity = (rgClass => {
            return function DIContainer() {
              return this.constructor === DIContainer
                ? new (rgClass.getConstructor(Array.prototype.slice.call(arguments, 0)))
                : (rgClass.getConstructor(Array.prototype.slice.call(arguments, 0), this)).call(this)
            }
          })(entity)
        } else {
          entity = entity.getInstance()
        }
      }
      extractedInjections.push(entity)
    }
    return extractedInjections
  }
}

module.exports = RegisterClass
