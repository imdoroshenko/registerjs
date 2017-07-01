registerjs
==========

Dependency injection manager inspired by AngularJS [DI](https://docs.angularjs.org/guide/di)

#Example

####Basic example
Let us create simple service that greet user. It's required output method and greeting pharse.

```js
// Greeter service
const Greeter = function ($greetOutputMethod, $greetPhrase) {
  this.outputMethod = $greetOutputMethod
  this.pharse = $greetPhrase
}
Greeter.prototype.greet = function (name) {
  this.outputMethod(this.pharse + ' ' + name + '!')
}
// console output method
function consoleOut(str) {
  console.log(str)
}
// alert output method
function alertOut(str) {
  window.alert(str)
}
```
You basically can use this service without any DI framework. But in this case you must remember and handle it dependencies in every place you want instantiate this service.

```js
const 
  consoleGreeter = new Greeter(consoleOut, 'Hello'),
  alertGreeter = new Greeter(alertOut, 'Hey')
  
consoleGreeter.greet('Mike') //will output "Hello Mike!" in browser console
alertGreeter.greet('Alex') //will output "Hey Alex!" through browser alert 
```
With registerjs you can create two DI containers with different dependencied for `Greeter`.
```js
rg.registerClass('ConsoleGreeter', Greeter, {
  greetOutputMethod: consoleGreeter,
  greetPhrase: 'Hello'
})
rg.registerClass('AlertGreeter', Greeter, {
  greetOutputMethod: alertOut,
  greetPhrase: 'Hey'
})
```
Now lets try to use `Greeter` in registerjs way
```js
const 
  consoleGreeter = rg.getInstance('ConsoleGreeter'),
  alertGreeter = rg.getInstance('AlertGreeter')
consoleGreeter.greet('Mike') //will output "Hello Mike!" in browser console
alertGreeter.greet('Alex') //will output "Hey Alex!" through browser alert 
```
As you can see, now you do not need to handle dependencies for `Greeter`. You simple use DI containers, Although 
entities `consoleGreeter` and `alertGreeter` is still instances of `Greeter`.
```js
console.log(consoleGreeter instanceof Greeter) //true
console.log(alertGreeter instanceof Greeter) //true
```
####Register Injection
In expample with `Greeter` we declared it dependencies in moment of creation DI container. This dependencies will be attached to DI container, and used by default with highest priority. But there is others approaches to declare dependencied. 
```js
// Lets create Service with two dependencies but register only with one of them.
const Service = function ($firstDependency, $secondDependency) {
 console.log($firstDependency, $secondDependency)
}
rg.registerClass('Service', Service, {firstDependency : 'Dependency attached to DI container'})
// Second dependency we will register in global registerjs injections repository
rg.registerInjection('secondDependency', 'dependency from registerjs repository')
// Now lets instantiate this Service
rg.getInstance('Service') //'Dependency attached to DI container', 'dependency from registerjs repository'
```
So when you instantiate registerjs class he will look for DI container dependencies in first place, then he will check registerjs injections repository, in last place he will check global namespace. So next approach will works too.
```js
rg.registerClass('Service', function ($firstDependency, $secondDependency) {
 console.log($firstDependency, $secondDepenency)
})
const 
  firstDependency = 'first dependency from global ns',
  secondDepenency = 'the second one'
rg.getInstance('Service') //'first dependency from global ns', 'the second one'
```
####Arguments
DI container still allow you to pass arguments to class constructor
```js
rg.registerClass('Service', 
  function ($firstDependency, fisrtArgument,  $secondDependency, secondArgument) {
 console.log('$firstDependency ->', $firstDependency)
 console.log('fisrtArgument ->', fisrtArgument)
 console.log('$secondDepenency ->', $secondDependency)
 console.log('secondArgument ->', secondArgument)
})
rg.registerInjections({
 firstDependency: 'first dependency',
 secondDependency: 'second dependency',
})
rg.getInstance('Service', 'first argument', 'second argument')
```
output:
```
$firstDependency -> first dependency 
fisrtArgument -> first argument 
$secondDepenency -> second dependency 
secondArgument -> second argument 
```
####Advanced example
Registerjs allow you to create bunch of services with deep dependencied.
```js
const
  Registerjs = require('../src/register'),
  rg = new Registerjs

/**
 * CoffeeMaker
 * @param {Grinder} $grinder
 * @param {Pump} $pump
 */
const CoffeeMaker = function ($grinder, $pump) {
  this.grinder = $grinder
  this.pump = $pump
}
CoffeeMaker.prototype.brew = function (name) {
  console.log('brewing coffee for ' + name)
  this.grinder.grind()
  this.pump.pump()
}
/**
 * Electricity class
 */
const Electricity = function () {}
Electricity.prototype.use = function (user) {
  console.log('electricity used by ' + user)
}
/**
 * Grinder
 * @param {Electricity} $electricity
 * @param {String} $coffee
 */
const Grinder = function ($electricity, $coffee) {
  this.electricity = $electricity
  this.coffee = $coffee
}
Grinder.prototype.grind = function () {
  this.electricity.use('Grinder')
  console.log('Coffee ' + this.coffee + ' is grind in Grinder')
}
/**
 * Heater
 * @param {Electricity} $electricity
 */
const Heater = function ($electricity) {
  this.electricity = $electricity
}
Heater.prototype.boil = function () {
  this.electricity.use('Heater')
  console.log('boil water in Heater')
}
/**
 * Pump
 * @param {Heater} $heater
 * @param {Electricity} $electricity
 */
const Pump = function ($heater, $electricity) {
  this.heater = $heater
  this.electricity = $electricity
}
Pump.prototype.pump = function () {
  console.log('Pump water trough Heater')
  this.electricity.use('Pump')
  this.heater.boil()
}
```
Lets use this classes by manualy handle their dependencies
```js
const 
  coffee = 'Jacobs',
  electricity = new Electricity(),
  grinder = new Grinder(electricity, coffee),
  heater = new Heater(electricity),
  pump = new Pump(heater, electricity),
  coffeeMaker = new CoffeeMaker(grinder, pump)

coffeeMaker.brew('Mike')
```
output:
```
brewing coffee for Mike
electricity used by Grinder
Coffee Jacobs is grind in Grinder
Pump water trough Heater
electricity used by Pump
electricity used by Heater 
boil water in Heater  
```
Simple, but it is easy to mess, and you probably need to create factories or strategies to keep Open/closed principle. Lets try to use this classes in registerjs way.
```js
rg.registerClasses(
    ['coffeeMaker', CoffeeMaker],
    ['grinder', Grinder],
    ['heater', Heater],
    ['pump', Pump]
)
// Electricity does not have any dependencies
// and we want to use single instance of it in all our classes
// so lets register it like simple injection
rg.registerInjections(
    ['electricity', new Electricity()],
    ['coffee', 'Jacobs']
)

rg.getInstance('coffeeMaker').brew('Mike')
```
output:
```
brewing coffee for Mike
electricity used by Grinder
Coffee Jacobs is grind in Grinder
Pump water trough Heater
electricity used by Pump
electricity used by Heater
boil water in Heater 
```
