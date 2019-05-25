//the client.js file for the base goal (left side in the browser)
$(document).ready(onReady);
//declare variable to hold the operator sign entered by the user
let operator = '';

function onReady() {
    //call the function to display calculation history at each browser refresh
    displayHistory();
    //add click event listener to the operator keys to get the calculation operator 
    //=> refactored by using .html to get the value
    $('.operatorButton').on('click', function() {
        operator = $(this).html();
        //change button color when clicked by user
        $(this).addClass('operatorClicked');
    })
    //add click event listener to the submit button to get input fields value 
    //and do the calculation
    $('#submitButton').on('click', getInputValueAndCalculate);
    //add click event listener to the clear button to clear the input fields
    $('#clearButton').on('click', clearInput);
    //add click event listener to the <li> to get a specific entry from history
    $('#historyUl').on('click', 'li', retrieveHistory);
    //add click event listener to the clear history button to clear history
    $('#clearHistory').on('click', clearHistory);

}

//function to display history entries
function displayHistory() {
    $.ajax({
        //hit the get route with url /history1 from server side
        method: 'GET',
        url: '/history1'
    }).then(
        response => {
            //clear the existing content in browser => avoid duplication
            $('#historyUl').empty();
            //loop through the response array and append to browser
            response.forEach(element => {
                let itemToAppend = $(`
                <li>${element.firstNumber} ${element.operator} ${element.secondNumber} = ${element.result}</li>
                `);
                $('#historyUl').append(itemToAppend);
                //attach the data method to the <li> => to be used at retrieveHistory function
                itemToAppend.data('id', element.id);
            })
        }

    )
}// end of displayHistory

//function to get input value and do the calculation
function getInputValueAndCalculate() {
    //get value from number input fields
    let firstNumber = $('#firstNumInput').val();
    let secondNumber = $('#secondNumInput').val();
    let calculationObj = {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: operator
    }
    //if any field is empty, pop up an alert
    if(firstNumber === '' || secondNumber === '' || operator === '') {
        alert('fields can not be empty');
        return;
    }

    //set the operator value back to empty string and button color back to white
    operator = '';
    $('.operatorButton').removeClass('operatorClicked');

    $.ajax({
        //hit the post route at /calculation1 from server side
        //where the calculation will be done and new obj will be pushed to array
        method: 'POST',
        url: '/calculation1',
        data: calculationObj
    }).then(
        response => {
            //receive calculation result from the response object from server side
            let result = response.result;
            //display result in browser
            $('#result').html(`<h2>${result}</h2>`);
            //call the function to display history (including the newly added one)
            displayHistory();
        }
    )

}//end of getInputValueAndCalculate


//function to clear the user input and the result display
function clearInput() {
    //setter
    $('#firstNumInput').val('');
    $('#secondNumInput').val('');

    $('#result').empty();
} //end of clearInput function

//function to retrieve one history entry
function retrieveHistory() {
    //use the data method attached to the <li> to get the id clicked
    //(note: this.data() returns an obj!!)
    let idClicked = $(this).data().id;
    //hit the history/:id route to get the object in the array with a specific id
    $.ajax({
        method: 'GET',
        url: '/history1/'+idClicked
    }).then(
        response => {
            //set the input values from the response object with that required id
            $('#firstNumInput').val(response.firstNumber);
            $('#secondNumInput').val(response.secondNumber);
            operator = response.operator;
            let buttonId = '';
            //get the button id from the response based on the operator value
            switch(operator){
                case '+':
                    buttonId = 'additionButton';
                    break;
                case '-':
                    buttonId = 'subtractionButton';
                    break;
                case '*':
                    buttonId = 'multiplicationButton';
                    break;
                case '/':
                    buttonId = 'divisionButton';
                    break;
            }
            $(`#${buttonId}`).addClass('operatorClicked');
        }
    )

}//end of retrieveHistory

//function to clear history
function clearHistory() {
    $.ajax({
        //hit the delete route at server side
        method: 'DELETE',
        url: '/delete1'
    }).then(() => {
        //refresh to empty the history display
        displayHistory();
    }  
    )
}//end of clearHistory



