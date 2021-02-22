const express = require('express');
require('dotenv/config');

const app = express();

app.get('/', (request, response) => {
    response.send('Im alive!');
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}!`);
});