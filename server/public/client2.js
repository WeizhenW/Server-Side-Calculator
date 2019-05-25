//stretch goal part
console.log('in js file 2');

let operatorKey = '';
let inputNumber = '';
let number1 = 0;
let number2 = 0;
let inputFormula = '';


$(document).ready(onReady);

function onReady() {
    //display history
    displayHistory2();    
    //get input value from the number key clicked
    $('.number').on('click', getKeyValue);
    //get operator
    $('.operatorKey').on('click', getOperator);
    //submit to calculate
    $('.equal').on('click', calculation);
    //clear the input button
    $('#keyClearButton').on('click', clearInput2);
    //clear history
    $('#clearHistory2').on('click', clearHistory2);

     //get the entry from history
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
    //get input value when key clicked
    let keyClicked = $(this).html();
    //concat the value to the variable to store the whole string
    inputFormula += keyClicked;
    //store input number
    inputNumber += keyClicked;
    //clear the keyClicked value
    keyClicked = '';
    //pass the value to the input field
    $('#keyInput').val(inputFormula);
    // console.log(inputNumber);
}//end of getKeyValue

//function to get the operator
function getOperator() {
    number1 = Number(inputNumber);
    inputNumber = '';
    operatorKey = $(this).html();
    inputFormula += operatorKey;
    $('#keyInput').val(inputFormula);

}// end of getOperator

//function calculation 
function calculation() {
    number2 = Number(inputNumber);
    inputNumber = '';
    inputFormula += '=';
    $('#keyInput').val(inputFormula);
    let calculationObj = {
        firstNumber: number1,
        secondNumber: number2,
        operator: operatorKey
    } 

    $.ajax({
        method: 'POST',
        url: '/calculation2',
        data: calculationObj
    }). then(
        response => {
            let result = response.result;
            inputFormula += result;
            $('#keyInput').val(inputFormula);
            $('#result2').html(`<h2>${result}</h2>`);
            displayHistory2();
        }
    )
}// end of calculation

//function to clear input
function clearInput2() {
    $('#keyInput').val('');
    $('#result2').empty();
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
    //get the id clicked(note: id this.data is an obj!)
    let idClicked = $(this).data().id;
    //hit the history/:id route to get the object in the array with a specific id
    $.ajax({
        method: 'GET',
        url: '/history2/'+idClicked
    }).then(
        response => {
            //set the input values from the response object with the required id
            inputFormula = response.firstNumber + response.operator + response.secondNumber;
            $('#keyInput').val(inputFormula);
            number1 = Number(response.firstNumber);
            inputNumber = Number(response.secondNumber);
            // console.log(number1, response.firstNumber, number2, response.secondNumber);
            operatorKey = response.operator;
       
        }
    )

}//end of retrieveHistory2