/**
 * Pump
 * @param {Heater} $heater
 * @param {Electricity} $electricity
 */
class Pump {
  constructor($$Heater, $electricity) {
    this.heater = $$Heater
    this.electricity = $electricity
  }
  pump() {
    console.log('Pump water trough Heater')
    this.electricity.use('Pump')
    this.heater.boil()
  }
}

module.exports = Pump
