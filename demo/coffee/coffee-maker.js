/**
 * CoffeeMaker
 * @param {Grinder} $grinder
 * @param {Pump} $pump
 */
class CoffeeMaker {
  constructor($$Grinder, $$Pump) {
    this.grinder = $$Grinder
    this.pump = $$Pump
  }
  brew(name) {
    console.log('brewing coffee for ' + name)
    this.grinder.grind()
    this.pump.pump()
  }
}

module.exports = CoffeeMaker
