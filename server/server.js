const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));




//listen to port
app.listen(port, () => {
    console.log(`in port ${port}`);
})