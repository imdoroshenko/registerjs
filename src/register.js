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
    },
    getInjection: function(name){
        return this.injections[name];
    }
};