console.log('in js');
$(document).ready(onReady);

let operator = '';

function onReady() {
    //display calculation history
    displayHistory();
    //get the calculation operator => to be refactored!!!
    $('#additionButton').on('click', function () {
        operator = "+";
        console.log(operator);
    })
    $('#subtractionButton').on('click', function () {
        operator = "-";
        console.log(operator);
    })
    $('#multiplicationButton').on('click', function () {
        operator = "*";
        console.log(operator);
    })
    $('#divisionButton').on('click', function () {
        operator = "/";
        console.log(operator);
    })

    //get input fields value by clicking the submit
    $('#submitButton').on('click', getInputValue);

    //clear the field
    $('#clearButton').on('click', clearInput);

}

//function to display history
function displayHistory() {
    $.ajax({
        method: 'GET',
        url: '/history'
    }).then(
        response => {
            $('#historyUl').empty();
            response.forEach(element => {
                $('#historyUl').append(`
                <li>${element.firstNumber} ${element.operator} ${element.secondNumber} = ${element.result}</li>
                `)
            })
        }

    )
}// end of displayHistory

//function to get input value
function getInputValue() {
    let firstNumber = $('#firstNumInput').val();
    let secondNumber = $('#secondNumInput').val();
    let calculationObj = {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: operator
    }
    console.log(calculationObj);

    $.ajax({
        method: 'POST',
        url: '/calculation',
        data: calculationObj
    }).then(
        response => {
            let result = response.result;
            $('#result').html(`<h2>${result}</h2>`);
            displayHistory();
        }
    )

}//end of getInputValue


//function to clear the user input
function clearInput() {
    $('input').val('');
}


