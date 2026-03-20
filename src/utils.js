// Utility functions

function calculateTotal(items) {
  return items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  // missing closing bracket for reduce callback and function
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email)
}

module.exports = { calculateTotal, formatCurrency, validateEmail };
