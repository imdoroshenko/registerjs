const
  {container, register} = require('../../src/container'),
  /*
   * container() function will not register injection but create DI container for current entity
   */
  CoffeeMaker = require('./coffee-maker'),
  CoffeeMakerDI = container(CoffeeMaker)

/*
 * After registration, entity will be available as injection across all modules in current app
 */
register('Grinder', require('./grinder'))
register('Heater', require('./heater'))
register('Pump', require('./pump'))
register('electricity', new (require('./electricity')))
register('coffee', 'Jacobs')

const coffeeMaker = new CoffeeMakerDI()

coffeeMaker.brew('Mike')

/*
 var coffee = 'Jacobs',
 electricity = new Electricity(),
 grinder = new Grinder(electricity, coffee),
 heater = new Heater(electricity),
 pump = new Pump(heater, electricity),
 coffeeMaker = new CoffeeMaker(grinder, pump)

 coffeeMaker.brew('Mike')
 */
