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

module.exports = Heater
