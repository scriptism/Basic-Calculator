const calculator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

function updateDisplay() {
  const display = document.querySelector(".calculator-screen");
  display.value = calculator.displayValue;
}

updateDisplay();

document
  .querySelector(".calculator-keys")
  .addEventListener("click", (event) => {
    const { target } = event;
    if (!target.matches("button")) {
      return;
    }

    if (target.classList.contains("operator")) {
      handleOperator(target.value);
      updateDisplay();
      return;
    }

    if (target.classList.contains("decimal")) {
      inputDecimal(target.value);
      updateDisplay();
      return;
    }

    if (target.classList.contains("all-clear")) {
      resetCalculator();
      updateDisplay();
      return;
    }

    if (target.classList.contains("equal-sign")) {
      handleEquals();
      updateDisplay();
      return;
    }

    inputDigit(target.value);
    updateDisplay();
  });

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue =
      displayValue === "0" ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = "0.";
    calculator.waitingForSecondOperand = false;
    return;
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

function handleEquals() {
  if (calculator.waitingForSecondOperand || calculator.operator === null) {
    return;
  }

  const inputValue = parseFloat(calculator.displayValue);
  if (isNaN(inputValue)) return;

  const result = calculate(
    calculator.firstOperand,
    inputValue,
    calculator.operator
  );

  // Handle Infinity symbol display
  if (result === "∞" || result === Infinity || result === -Infinity) {
    calculator.displayValue = "∞";
  } else {
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
  }

  calculator.firstOperand = result;
  calculator.waitingForSecondOperand = true;
  calculator.operator = null;
}

function calculate(firstOperand, secondOperand, operator) {
  switch (operator) {
    case "+":
      return firstOperand + secondOperand;
    case "-":
      return firstOperand - secondOperand;
    case "*":
      return firstOperand * secondOperand;
    case "/":
      if (secondOperand === 0) {
        return "∞";
      }
      return firstOperand / secondOperand;
    default:
      return secondOperand;
  }
}

function resetCalculator() {
  calculator.displayValue = "0";
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}
