class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousNumberTextElement = previousOperandTextElement;
        this.currentNumberTextElement = currentOperandTextElement;
        this.clear();
    }
// Clear the display
    clear() {
        this.currNum = '';
        this.prevNum = '';
        this.operation = undefined;
        this.updateDisplay();
        this.degrees = false;
    }
// Delete the current number(s) on the display by slicing it
    delete() {
        this.currNum = this.currNum.toString().slice(0, -1);
        this.updateDisplay();
    }

// Add numbers to the display as we type them
    addNumber(number) {
        // Prevent the user from adding multiple decimal points
        if (number === '.' && this.currNum.includes('.')) {
            return
        }
        // Special case for pi
        if (number === 'π') {
            number = Math.PI;
        }
        // Add the previous number (still currentNumber) and new number together
        this.currNum = this.currNum.toString() + number.toString();
        // Update the display
        this.updateDisplay();
    }

    // Sets which mathematical operation should be used
    chooseOperation(operation) {
        // Ensure a number was selected first
        // OR in the case of log/ln/exp/sin/cos/tan that we don't just override it with the return
        if (this.currNum === '' && operation !== 'log' && operation !== 'ln' && operation !== 'sin' && operation !== 'cos' && operation !== 'tan' && operation !== '-') {
            return
        }
        // Ensure there is a valid previous number to do something with
        // OR in the case of log/ln/exp/sin/cos/tan that we still do the actual operation
        if (this.prevNum !== '' || this.operation === 'log' || this.operation === 'ln' || this.operation === 'sin' || this.operation === 'cos' || this.operation === 'tan') {
            // Compute the operation
            this.compute();
        }
        // This is admin to do with displaying things correctly
        this.operation = operation;
        this.prevNum = this.currNum;
        this.currNum = '';
        this.updateDisplay();
    }

    compute() {
        // Check if an operation was selected
        if (typeof this.operation === 'undefined') {
            console.log('Operand is undefined');
            return
        }
        // Declare the variable to store our answer in
        let answer;
        // Convert current and previous numbers from str to float
        const prev = parseFloat(this.prevNum);
        const curr = parseFloat(this.currNum);
        // Check if the user entered two separate numbers
        if ((isNaN(prev) || isNaN(curr)) && this.operation !== 'log' && this.operation !== 'ln' && this.operation !== 'sin' && this.operation !== 'cos' && this.operation !== 'tan') {
            return
        }
        // Do the actual mathematical operation here to get our answer
        switch (this.operation) {
            case '+':
                answer = prev + curr;
                break;
            case '-':
                answer = prev - curr;
                break;
            case 'x':
                answer = prev * curr;
                break;
            case '÷':
                answer = prev / curr;
                break;
            case 'log':
                answer = Math.log(curr) / Math.log(10);
                break;
            case 'ln':
                answer = Math.log(curr);
                break;
            case 'exp':
                answer = prev ** curr;
                break;
            case 'sin':
                answer = Math.sin(curr);
                if (this.degrees) {
                    answer = answer * (180/Math.PI);
                }
                break;
            case 'cos':
                answer = Math.cos(curr);
                if (this.degrees) {
                    answer = answer * (180/Math.PI);
                }
                break;
            case 'tan':
                answer = Math.tan(curr);
                if (this.degrees) {
                    answer = answer * (180/Math.PI);
                }
                break;
            default:
                return;
        }
        // Set current number to the answer
        this.currNum = answer;
        // Reset the operation
        this.operation = undefined;
        // Reset the previous number (because we have our answer now)
        this.prevNum = '';
        // Display the answer
        this.updateDisplay();
    }

    // Admin code to display the current, previous numbers correctly as well as the operation
    updateDisplay() {
        // Check if an actual operation has been selected and add it to the previous number
        if (typeof this.operation !== 'undefined') {
            // Update the current number
            this.currentNumberTextElement.innerText = this.currNum ;
            // Update the previous number with the selected operand
            this.previousNumberTextElement.innerText = this.prevNum + this.operation;
        }
        else{
            // Else everyhting stays as it is
            this.currentNumberTextElement.innerText = this.currNum;
            this.previousNumberTextElement.innerText = this.prevNum;
        }
    }
}

// Declare constants that hold the number, operation, and equals buttons
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
// Add an event listener to the equals button so that we know when to compute the operation
// The arrow function calls the calculator class's compute() function
equalsButton.addEventListener('click', () => { calculator.compute() });
// Declare a constant and click event listener for the delete button
const deleteButton = document.querySelector('[data-delete]');
deleteButton.addEventListener('click', () => {calculator.delete()});
const allClearButton = document.querySelector('[data-all-clear]');
allClearButton.addEventListener('click', () => { calculator.clear() });
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Create a new calculator object with default initial values
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Add event listeners to every number button by looping through the numberButtons constant
// The value of each number is pulled from the HTML element's inner text and is appropriately updated in calculater.appendNumber
for (let index = 0; index < numberButtons.length; index++) {
    numberButtons[index].addEventListener('click', () => { calculator.addNumber(numberButtons[index].innerText) });
}

// Do the same for the operation buttons
for (let index = 0; index < operationButtons.length; index++) {
    operationButtons[index].addEventListener('click', () => { calculator.chooseOperation(operationButtons[index].innerText) });
}


/* I HAVE TO DO THE DARK MODE CODE IN HERE AND I DON'T KNOW WHY IT WON'T WORK IN A SEPERATE .js */
// Use local storage to store offline, no need for cookies because we're not connecting to the server.
// Use let so that it can be changed again later
let darkMode = localStorage.getItem("darkmodeToggled");
// Query the button through its ID
// This variable toggles when our dark mode button is clicked
// Create the variable by referencing the button's ID
// Use const because then it is static, can't be changed
const darkModeToggle = document.getElementById("button-dark-mode");

// Create global enable/disable functions so that we can reference it everywhere
const enableDarkMode = () => {
    // Add the darkMode class to the body
    document.body.classList.add("darkmode");
    // Update darkMode in localStorage
    // Set darkMode in localStorage to "enabled"
    localStorage.setItem("darkmodeToggled", "enabled");
}
const disableDarkMode = () => {
    // Add the darkMode class to the body
    document.body.classList.remove("darkmode");
    // Update darkMode in localStorage
    // Set darkMode in localStorage to "disabled"
    localStorage.setItem("darkmodeToggled", "disabled");
}

// Check if dark mode was enabled/disabled on last visit
if (darkMode == "enabled") {
    enableDarkMode();
}

// Arrow function for turning on/off dark mode upon button click
darkModeToggle.addEventListener('click', () => {
    // Update darkMode variable toggle to whatever it was when the user closed the page last time
    darkMode = localStorage.getItem("darkmodeToggled");
    if (darkMode !== 'enabled') 
    {
        // Then turn on dark mode
        enableDarkMode();
    }
    else {
        disableDarkMode();
    }
});

// Get the existing button by its id
var degreesButton = document.getElementById('button-degrees');

// Add a click event listener to the existing button
degreesButton.addEventListener('click', function () {

    // Create a new button element
    var radiansButton = document.createElement('button');
    
    // Set the inner text of the new button
    radiansButton.innerText = 'Radians';
    radiansButton.id = 'button-radians';
    radiansButton.classList.add("settings-button");
    
    // Append the new button to the body of the document
    document.getElementById("admin").appendChild(radiansButton);
    
    // Hide the degrees button
    degreesButton.style.visibility = 'hidden';
    degreesButton.disabled = true;

    // Set the degrees flag to true
    calculator.degrees = true;

    radiansButton.addEventListener('click', function () {
        // Show the degrees button
        degreesButton.style.visibility = 'visible';
        degreesButton.disabled = false;
        // Delete the radians button
        document.getElementById("admin").removeChild(radiansButton);
        // Set the degrees flag to false
        calculator.degrees = false;
    })
});