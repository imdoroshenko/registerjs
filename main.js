var Register = function(){
    this.classes = {};
    this.injections = {};
};
Register.prototype = {
    registerClass : function(name, func, injections){
        this.classes[name] = this.injections[name] = new RegisterClass(func, injections, this.injections);
        return this;
    },
    registerClasses : function(){
        var args = Array.prototype.slice.call(arguments);
        for(var i = 0, ln = args.length; i < ln; i++){
            this.registerClass(args[i][0], args[i][1], args[i][2]);
        }
        return this;
    },
    registerInjection : function(name, value){
        this.injections[name] = value;
        return this;
    },
    registerInjections : function(injections){
        if (Array.isArray(injections)) {
            var args = Array.prototype.slice.call(arguments);
            for(var i = 0, ln = args.length; i < ln; i++){
                this.registerInjection(args[i][0], args[i][1]);
            }
        } else {
            for(var name in injections){
                if(injections.hasOwnProperty(name)){
                    this.registerInjection(name, injections[name]);
                }
            }
        }
        return this;
    },
    getInstance : function(){
        var args = Array.prototype.slice.call(arguments, 1);
        return this.classes[arguments[0]].getInstance(args);
    }
};
var RegisterClass = function RegisterClass(func, injections, globalInjections){
    this.static = RegisterClass;
    this._func = func;
    this._ownInjections = injections||{};
    this._globalInjections = globalInjections||{};
    this._args = this.extractArgs(this._func.toString());
    this._argsLn = this._args.length;
};
RegisterClass.prototype = {
    /*
    * thanks to angularjs team
    * */
    FN_ARGS : /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT : /\s*,\s*/,
    FN_ARG : /^\s*(_?)(\S+?)\1\s*$/,
    STRIP_COMMENTS : /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
    global : window,
    undefined : void 0,
    extractArgs : function(source){
        var args = [],
            fnText = source.replace(this.STRIP_COMMENTS, ''),
            argDecl = fnText.match(this.FN_ARGS);
        argDecl && argDecl[1] && argDecl[1].split(this.FN_ARG_SPLIT).forEach(function(arg){
            arg.replace(this.FN_ARG, function(all, underscore, name){
                args.push(name.indexOf('$') === 0
                    ? name.substr(1)
                    : null);
            });
        }.bind(this));
        return args;
    },
    getInstance : function(args){
        return new (this.getConstructor(args));
    },
    getType : function(){
        return this._func;
    },
    getConstructor : function(args){
        var injections = this.extractInjections();
        for(var i = 0; args && args[0]; i++){
            if(injections[i] === this.undefined){
                injections[i] = args.shift();
            }
        }
        return (Function.prototype.bind.apply(this._func, [null].concat(injections)))
    },
    _extract : function(str){
        try{
            var target = this.global;
            str.split('.').forEach(function(scope){
                target = target[scope];
            });
            return target;
        }catch(e){
            return undefined;
        }
    },
    extractInjections : function(){
        var extractedInjections = [];
        for(var i = 0, ln = this._args.length; i < ln; i++){
            var name = this._args[i];
            var entity = name
                ? (this._ownInjections[name] || this._globalInjections[name] || this._extract(name) || null)
                : this.undefined;
            if(entity && entity instanceof this.static){
                entity = name[0].toUpperCase() === name[0]
                    ? entity.getConstructor()
                    : entity.getInstance();
            }
            extractedInjections.push(entity);
        }
        return extractedInjections;
    }
};
var rg = new Register();