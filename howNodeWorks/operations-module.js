exports.add = (a, b) => a + b;
exports.subb = (a, b)=> a - b;
exports.multiply = (a, b)=> a * b;

exports.divide = (a, b) => {
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
};
