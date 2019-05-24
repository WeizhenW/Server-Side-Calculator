const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 5000;
const calculationHistory = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

//create a get route for all history
app.get('/history', (req, res) => {
    res.send(calculationHistory);
})

app.post('/calculation', (req, res) => {
    console.log(req.body);

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
        result: result
    }
    // console.log(calculationObj);

    calculationHistory.push(calculationObj);
    res.send(calculationObj);

    // res.sendStatus(201);
})



//listen to port
app.listen(port, () => {
    console.log(`in port ${port}`);
})