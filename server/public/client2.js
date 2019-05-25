//the client.js file for the stretch goal (right side in the browser)
$(document).ready(onReady);

let operatorKey = '';//variable to hold the operator input
let inputNumber = '';//variable to temporarily hold each input number
let number1 = 0;//first number in the calculation
let number2 = 0;//second number in the calculation
let inputFormula = '';//variable to temporarily hold the entire input formula

function onReady() {
    //call function display history
    displayHistory2();    
    //add click event listener to all the number keys
    //to get input value from the number key clicked
    $('.number').on('click', getKeyValue);
    //add click event listener to all operator keys to get operator
    $('.operatorKey').on('click', getOperator);
    //add click event listener to '=' key to calculate
    $('.equal').on('click', calculation);
    //add click event listener to clear the input button
    $('#keyClearButton').on('click', clearInput2);
    //add click event listener to clear history
    $('#clearHistory2').on('click', clearHistory2);
    //add click event listener to get one entry from history
    $('#historyUl2').on('click', 'li', retrieveHistory2);
}

//display the history function
function displayHistory2() {
    $.ajax({
        method: 'GET',
        url: '/history2'
    }).then(
        response => {
            $('#historyUl2').empty();
            response.forEach(element => {
                let itemToAppend = $(`
                <li>${element.firstNumber} ${element.operator} ${element.secondNumber} = ${element.result}</li>
                `);
                $('#historyUl2').append(itemToAppend);
                itemToAppend.data('id', element.id);
            })
        }

    )
}// end of displayHistory

//function to get the number key clicked
function getKeyValue() {
    //get input value when a single number key clicked
    let keyClicked = $(this).html();
    //concat this number to the inputFormula variable to store the whole string
    inputFormula += keyClicked;
    //concat this number to the inputNumber variable to store the input number
    inputNumber += keyClicked;
    //reset the keyClicked value
    keyClicked = '';
    //setter - pass the inputFormula value to the input field
    $('#keyInput').val(inputFormula);
}//end of getKeyValue

//function to get the operator
function getOperator() {
    //when the operator key is clicked, assign the value from inputNumber to number1
    //number1 will be used as the first number in the calculation
    number1 = Number(inputNumber);
    //reset inputNumber
    inputNumber = '';
    //get operator value
    operatorKey = $(this).html();
    //concat the operator clicked to the inputFormula
    inputFormula += operatorKey;
    //val setter to the input field
    $('#keyInput').val(inputFormula);
}// end of getOperator

//function calculation 
function calculation() {
    //when the '=' key is clicked, assign the inputNumber value to the number2 variable
    //number2 will be used as second number in the calculation
    number2 = Number(inputNumber);
    //reset value
    inputNumber = '';
    //concat '=' to the inputFormula string
    inputFormula += '=';
    //val setter
    $('#keyInput').val(inputFormula);
    //build the object to pass to the server side for calculation
    let calculationObj = {
        firstNumber: number1,
        secondNumber: number2,
        operator: operatorKey
    } 

    //   //if any field is empty, pop up an alert
    //   if(number1 === '' || number2 === '' || operatorKey === '') {
    //     alert('fields can not be empty');
    //     return;
    // }

    $.ajax({
        //hit the calculation post route
        method: 'POST',
        url: '/calculation2',
        data: calculationObj
    }). then(
        response => {
            //response from the post route is a single object which contains two numbers, operator value and the result
            //get calculation result from the response
            let result = response.result;
            //concat to the inputFormula
            inputFormula += result;
            //val setter
            $('#keyInput').val(inputFormula);
            //display result
            $('#result2').html(`<h2>${result}</h2>`);
            //reset value for inputFormula and inputNumber
            inputFormula = '';
            inputNumber = '';
            //call function to refresh the history
            displayHistory2();
        }
    )
}// end of calculation

//function to clear input
function clearInput2() {
    $('#keyInput').val('');
    $('#result2').empty();
    
}//end of clearInput2

//function to clear history
function clearHistory2() {
    $.ajax({
        method: 'DELETE',
        url: '/delete2'
    }).then(() => {
        displayHistory2();
    }  
    )
}//end of clearHistory

//function to retrieve the history entry
function retrieveHistory2() {
    //get the id clicked(note: this.data is an obj!!)
    let idClicked = $(this).data().id;
    //hit the history/:id route to get the object in the array with a specific id
    $.ajax({
        method: 'GET',
        url: '/history2/'+idClicked
    }).then(
        response => {
            //response is a single object with numbers, operator and result for that specific id
            //concat to the inputFormula string
            inputFormula = response.firstNumber + response.operator + response.secondNumber;
            //val setter
            $('#keyInput').val(inputFormula);
            //get number1 from the response object
            number1 = Number(response.firstNumber);
            //get inputNumber from response object (will be assigned to number2 when call the calculation function)
            inputNumber = Number(response.secondNumber);
            //get operator from the response object
            operatorKey = response.operator;
       
        }
    )

}//end of retrieveHistory2

//----------POSSIBLE IMPROVEMENT ------
//for the stretch goal: 
//accept both clicking keypad and user input from keyboard?
//if only number1 is entered (without entering the operator) => calculator not working
//what if calculating more than 2 numbers?