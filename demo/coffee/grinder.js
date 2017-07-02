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

module.exports = Grinder
