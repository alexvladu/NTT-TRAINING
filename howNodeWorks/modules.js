const C= require('./calculator-module');
const calc1=new C();
console.log(calc1.add(3, 5));


const calc2=require('./operations-module');

const {add, subb, multiply, divide}=calc2;

console.log(subb(3, 5));


require('./test-export')();
require('./test-export')();
require('./test-export')();