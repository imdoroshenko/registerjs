const RegisterClass = require('./registerclass')

const Register = function(){
  this.classes = {}
  this.injections = {}
}
Register.prototype = {
  registerClass : function(name, func, injections){
    this.classes[name] = this.injections[name] = new RegisterClass(func, injections, this.injections)
    return this
  },
  registerClasses : function(){
    const args = Array.prototype.slice.call(arguments)
    for(let i = 0, ln = args.length; i < ln; i++){
      this.registerClass(args[i][0], args[i][1], args[i][2])
    }
    return this
  },
  registerInjection : function(name, value){
    this.injections[name] = value
    return this
  },
  registerInjections : function(injections){
    if (Array.isArray(injections)) {
      const args = Array.prototype.slice.call(arguments)
      for(let i = 0, ln = args.length; i < ln; i++){
        this.registerInjection(args[i][0], args[i][1])
      }
    } else {
      for(let name in injections){
        if(injections.hasOwnProperty(name)){
          this.registerInjection(name, injections[name])
        }
      }
    }
    return this
  },
  getInstance : function(){
    const args = Array.prototype.slice.call(arguments, 1)
    return this.classes[arguments[0]].getInstance(args)
  },
  getInjection: function(name){
    return this.injections[name]
  }
}

module.exports = Register
