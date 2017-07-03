const {container, register} = require('../src/container')
/**
 * CoffeeMaker
 * @param {Grinder} $grinder
 * @param {Pump} $pump
 */
class CoffeeMaker {
  constructor($$grinder, $$pump) {
    this.grinder = $$grinder
    this.pump = $$pump
  }
  brew(name) {
    console.log('brewing coffee for ' + name)
    this.grinder.grind()
    this.pump.pump()
  }
}
/**
 * Electricity class
 */
class Electricity {
  use(user) {
    console.log('electricity used by ' + user)
  }
}
/**
 * Grinder
 * @param {Electricity} $electricity
 * @param {String} $coffee
 */
class Grinder {
  constructor($electricity, $coffee) {
    this.electricity = $electricity
    this.coffee = $coffee
  }
  grind() {
    this.electricity.use('Grinder')
    console.log('Coffee ' + this.coffee + ' is grind in Grinder')
  }
}
/**
 * Heater
 * @param {Electricity} $electricity
 */
class Heater {
  constructor($electricity) {
    this.electricity = $electricity
  }
  boil() {
    this.electricity.use('Heater')
    console.log('boil water in Heater')
  }
}
/**
 * Pump
 * @param {Heater} $heater
 * @param {Electricity} $electricity
 */
class Pump {
  constructor($$heater, $electricity) {
    this.heater = $$heater
    this.electricity = $electricity
  }
  pump() {
    console.log('Pump water trough Heater')
    this.electricity.use('Pump')
    this.heater.boil()
  }
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
