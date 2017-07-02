const {container, register} = require('./src/container')

class Test{
  constructor($a, $b) {
    console.log('constructor', $a, $b)
  }

  method() {
    console.log('method')
  }
}

register('a', 5)
register('b', 10)

register('multi', ($a, $b) => {return $a * $b})
let wrapped = container(Test)

let func = container(($a, $b, $multi) => {
  return $multi()
})

let a = new wrapped()
a.method(124)
console.log(func(5))
