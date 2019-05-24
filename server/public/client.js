console.log('in js');
$(document).ready(onReady);

let operator = '';

function onReady() {
    //display calculation history
    displayHistory();
    //get the calculation operator => refactored by using .html to get the value
    $('.operatorButton').on('click', function() {
        operator = $(this).html();
    })
    //get input fields value by clicking the submit
    $('#submitButton').on('click', getInputValue);
    //clear the field
    $('#clearButton').on('click', clearInput);
    //get the entry from history
    $('#historyUl').on('click', 'li', retrieveHistory);

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
                let itemToAppend = $(`
                <li>${element.firstNumber} ${element.operator} ${element.secondNumber} = ${element.result}</li>
                `);
                $('#historyUl').append(itemToAppend);
                itemToAppend.data('id', element.id);
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
    if(firstNumber === '' || secondNumber === '' || operator === '') {
        $('#result').html(`<h2>fields can not be left blank!</h2>`);
        return;
    }

    //set the operator value back to empty string
    operator = '';

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


//function to clear the user input and the result display
function clearInput() {
    $('input').val('');
    $('#result').empty();
} //end of clearInput function

//function to retrieve the history entry
function retrieveHistory() {
    //get the id clicked(note: id this.data is an obj!)
    let idClicked = $(this).data().id;
    //hit the history/:id route to get the object in the array with a specific id
    $.ajax({
        method: 'GET',
        url: '/history/'+idClicked
    }).then(
        response => {
            //set the input values from the response object with the required id
            $('#firstNumInput').val(response.firstNumber);
            $('#secondNumInput').val(response.secondNumber);
            operator = response.operator;
            //call the calculation function
            getInputValue();
        }
    )

}//end of the retrieveHistory