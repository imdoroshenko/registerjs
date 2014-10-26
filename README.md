registerjs
==========

Dependency injection manager inspired by AngularJS [DI](https://docs.angularjs.org/guide/di)

#Example

####Basic example
Let us create simple service that greet user. It's required output method and greeting pharse.

```js
/**
  * Greeter service
  */
var Greeter = function ($greetOutputMethod, $greetPharse) {
  this.outputMethod = $greetOutputMethod;
  this.pharse = $greetPharse;
};
Greeter.prototype.greet = function (name) {
  this.outputMethod(pharse + ' ' + name + '!');
};
/**
  * console output method
  */
var consoleOut = function (str) {
  console.log(str);
};
/**
  * alert output method
  */
var alertOut = function (str) {
  window.aler(str);
};
```
You basicly can use this service without any DI framework. But in this case you must remember and handle it
dependencies in every place you want instantiate this service.

```js
var consoleGreeter = new Greeter(consoleOut, 'Hello'),
    alertGreeter = new Greeter(alertOut, 'Hey');
consoleGreeter.greet('Mike'); //will output "Hello Mike!" in browser console
alertGreeter.greet('Alex'); //will output "Hey Alex!" through browser alert 
```
With registerjs you can create two DI containers with different dependencied for `Greeter`.
```js
rg.registerClass('ConsoleGreeter', Greeter, {
  greetOutputMethod: consoleGreeter,
  greetPharse: 'Hello'
}); 
rg.registerClass('AlertGreeter', Greeter, {
  greetOutputMethod: alertOut,
  greetPharse: 'Hey'
}); 
```
Now lets try to use `Greeter` in registerjs way
```js
var consoleGreeter = rg.getInstance('ConsoleGreeter'),
    alertGreeter = rg.getInstance('AlertGreeter');
consoleGreeter.greet('Mike'); //will output "Hello Mike!" in browser console
alertGreeter.greet('Alex'); //will output "Hey Alex!" through browser alert 
```
As you can see, now you do not need to handle dependencies for `Greeter`. You simple use DI containers, Although 
entities `consoleGreeter` and `alertGreeter` is still instances of `Greeter`.
```js
console.log(consoleGreeter instanceof Greeter); //true
console.log(alertGreeter instanceof Greeter); //true
```
