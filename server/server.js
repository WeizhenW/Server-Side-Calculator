const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 5000;
const calculationHistory = [];
//initialize id to track the calculation history
let id = 0;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

//create a get route for all history
app.get('/history', (req, res) => {
    res.send(calculationHistory);
})
//create a post route for the calculation
app.post('/calculation', (req, res) => {

    let firstNumber = req.body.firstNumber;
    let secondNumber = req.body.secondNumber;
    let operator = req.body.operator;
    let result = 0;

    switch(operator) {
        case '+':
            result = Number(firstNumber) + Number(secondNumber);
            break;
        case '-':
            result = Number(firstNumber) - Number(secondNumber);
            break;
        case '*':
            result = Number(firstNumber) * Number(secondNumber);
            break;
        case '/':
            result = Number(firstNumber) / Number(secondNumber);
            break;
    }
    let calculationObj = {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: operator,
        result: result,
        id: id
    }
    //change counter by adding one
    id += 1;
    calculationHistory.push(calculationObj);
    res.send(calculationObj);
})

//create a get route for a specific entry in the history
app.get('/history/:id', (req, res) => {
    let idRequested = req.params.id;
    for(let item of calculationHistory) {
        if(item.id == idRequested) {
            res.send(item);
        }
    }
})

//listen to port
app.listen(port, () => {
    console.log(`in port ${port}`);
})