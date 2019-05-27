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
    //get input value
    $('.keyInput').on('click', getInputValue);
    //add click event listener to '=' key to trigger the calculation
    $('.equal').on('click', calculation2);
    //add click event listener to clear the input button
    $('#keyClearButton').on('click', clearInput2);
    //add click event listener to clear history
    $('#clearHistory2').on('click', clearHistory2);
    //add click event listener to get one entry from history
    $('#historyUl2').on('click', 'li', retrieveHistory2);
}

//function to get input value
function getInputValue() {
   inputNumber = $(this).html();
   inputFormula += inputNumber;
   $('#keyInput').val(inputFormula);
}

//function to calculate
function calculation2() {
    inputFormula += '=';
    $('#keyInput').val(inputFormula);
    let regE = /[+|\-|*|/]/g;
    if(inputFormula[0] !== '+' && inputFormula[0] !== '-') {
        // console.log('in if');
        // console.log('inputFormula', inputFormula);
        // console.log('reg E', regE);
        let operatorIndex = inputFormula.search(regE);
        // console.log('operatorIndex', operatorIndex);
        if(operatorIndex === -1) {
            number1 = inputFormula.slice(0, inputFormula.length-1);
            number2 = '';
            operatorKey = '';
            console.log(number1, number2, operatorKey);
        } else {   
            number1 = inputFormula.slice(0, operatorIndex);
            // console.log('number1', number1);
            operatorKey = inputFormula.slice(operatorIndex, operatorIndex+1);
            // console.log('operatorKey', operatorKey);
            number2 = inputFormula.slice(operatorIndex+1, inputFormula.length-1);
            // console.log('number2', number2);

        }

    } else {
        // console.log('in else');
        let operatorIndex = inputFormula.slice(1, inputFormula.length).search(regE);
        // console.log('operatorIndex', operatorIndex);
        if(operatorIndex === -1) {
            number1 = inputFormula.slice(0, inputFormula.length-1);
            number2 = '';
            operatorKey = '';
        } else {      
            number1 = inputFormula.slice(0, operatorIndex+1);
            operatorKey = inputFormula.slice(operatorIndex+1, operatorIndex+2);
            number2 = inputFormula.slice(operatorIndex+2, inputFormula.length-1);
            console.log(number1, operatorKey, number2)

        }
  
    }

    //build the object to pass to the server side for calculation
    let calculationObj = {
        firstNumber: number1,
        secondNumber: number2,
        operator: operatorKey
    } 

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
            console.log('result', result);
            //val setter
            $('#keyInput').val(inputFormula);
            //display result
            $('#result2').html(`<h2>${result}</h2>`);
            //reset value for inputFormula and inputNumber
            inputFormula = '';
            inputNumber = '';
            number1 = 0;
            number2 = 0;
            operatorKey = '';
            //call function to refresh the history
            displayHistory2();
        }
    )
}// end of calculation2


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
}// end of displayHistory2

//function to clear input
function clearInput2() {
    $('#keyInput').val('');
    $('#result2').empty();
    //reset value for inputFormula and inputNumber
    inputFormula = '';
    inputNumber = '';
    
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
//what if calculating more than 2 numbers?