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
You basicly can use this service without any DI framework. But in this case you must remember and handle it dependencies in every place you want instantiate this service.

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
####Register Injection
In expample with `Greeter` we declared it dependencies in moment of creation DI container. This dependencies will be attached to DI container, and used by default with highest priority. But there is others approaches to declare dependencied. 
```js
/**
 * Lets create Service with two dependencies and register it  only with one of them.
 */
var Service = function ($firstDependency, $secondDepenency) {
 console.log($firstDependency, $secondDepenency);
};
rg.registerClass('Service', Service, {firstDependency : 'Dependency attached to DI container'});
/**
 * Second dependency we will register in global registerjs injections repository
 */
rg.registerInjection('secondDepenency', 'dependency from registerjs repository');
/**
 * Now lets instantiate this Service
 */
rg.getInstance('Service'); //'Dependency attached to DI container', 'dependency from registerjs repository'
```
So when you instantiate registerjs class he will look for DI container dependencies in first place, then he will check registerjs injections repository, and for the last he will check global namespace. So next code will works to.
```js
rg.registerClass('Service', function ($firstDependency, $secondDepenency) {
 console.log($firstDependency, $secondDepenency);
});
var firstDependency = 'first dependency from global ns',
    secondDepenency = 'the second one';
rg.getInstance('Service'); //'first dependency from global ns', 'the second one'
```
