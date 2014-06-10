var register = new Register();
var user = {name : 'Victor'};
var greet = 'Hello ';
var A = function($greet, $user){
    console.log(arguments);
    this.greet = $greet||'';
    this.user = $user||{name : 'Yan'};
};
A.prototype.say = function(){
    console.log(this.greet.concat(' ', this.user.name, '!'));
};

var B = function (
    $Greeter,
    test,
    $huemoe,
    $greet,
    a,
    $b
    ){
    console.log(arguments);
    this.greeter = new $Greeter();
};
B.prototype.greet = function(){
    this.greeter.say();
};

register.registerClasses(
    ['Greeter', A],
    ['Main', B]
);

var main = register.getInstance('Main', window, console);
main.greet();
