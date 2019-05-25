const express = require('express');
const calculationHistory1 = [];//to store the history from base goal
const calculationHistory2 = [];//to store the history from stretch goal

const app = express();
const bodyParser = require('body-parser');

const port = 5000;

//initialize id to track the calculation history
let id1 = 0;
let id2 = 0;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

//create a get route for all history for base goal
app.get('/history1', (req, res) => {
    res.send(calculationHistory1);
})

//create a get route for all history for stretch
app.get('/history2', (req, res) => {
    res.send(calculationHistory2);
})

//create a post route for the calculation for base goal
app.post('/calculation1', (req, res) => {

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
        id: id1
    }
    //change counter by adding one
    id1 += 1;
    calculationHistory1.push(calculationObj);
    res.send(calculationObj);
})

//create a post route for the calculation for stretch
app.post('/calculation2', (req, res) => {

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
        id: id2
    }
    //change counter by adding one
    id2 += 1;
    calculationHistory2.push(calculationObj);
    res.send(calculationObj);
})

//create a get route for a specific entry in the history
app.get('/history1/:id', (req, res) => {
    let idRequested = req.params.id;
    for(let item of calculationHistory1) {
        if(item.id == idRequested) {
            res.send(item);
        }
    }
})

//create a delete route to clear the history
app.delete('/delete', (req, res) => {
    calculationHistory1.splice(0, calculationHistory1.length);
    res.sendStatus(201);
})

//create a delete route to clear the history for stretch goal
app.delete('/delete2', (req, res) => {
    calculationHistory2.splice(0, calculationHistory2.length);
    res.sendStatus(201);
})

//create a get route for a specific entry in the history for stretch goal
app.get('/history2/:id', (req, res) => {
    let idRequested = req.params.id;
    for(let item of calculationHistory2) {
        if(item.id == idRequested) {
            res.send(item);
        }
    }
})

//listen to port
app.listen(port, () => {
    console.log(`in port ${port}`);
})

