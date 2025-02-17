class Calculator{
    add(a, b) {
        return a + b;
    }
    subb(a, b) {
        return a - b;
    }
    mult(a, b) {
        return a * b;
    }
    divd(a, b) {
        if(b === 0) {
            throw new Error("Division by zero is not allowed.");
        }
        return a / b;
    }
}
module.exports = Calculator;