const
  {container, register} = require('../../src/container'),
  CoffeeMaker = require('./coffee-maker')

register('Grinder', require('./grinder'))
register('Heater', require('./heater'))
register('Pump', require('./pump'))
register('electricity', new (require('./electricity')))
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
