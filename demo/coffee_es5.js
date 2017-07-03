const {container, register} = require('../src/container')

/**
 * CoffeeMaker
 * @param {Grinder} $grinder
 * @param {Pump} $pump
 */
const CoffeeMaker = function ($$grinder, $$pump) {
  this.grinder = $$grinder
  this.pump = $$pump
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
const Pump = function ($$heater, $electricity) {
  this.heater = $$heater
  this.electricity = $electricity
}
Pump.prototype.pump = function () {
  console.log('Pump water trough Heater')
  this.electricity.use('Pump')
  this.heater.boil()
}


register('grinder', Grinder)
register('heater', Heater)
register('pump', Pump)
register('electricity', new Electricity())
register('coffee', 'Jacobs')

;(new (container(CoffeeMaker))).brew('Mike')
/*
 var coffee = 'Jacobs',
 electricity = new Electricity(),
 grinder = new Grinder(electricity, coffee),
 heater = new Heater(electricity),
 pump = new Pump(heater, electricity),
 coffeeMaker = new CoffeeMaker(grinder, pump)

 coffeeMaker.brew('Mike')
 */
