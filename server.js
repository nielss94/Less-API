const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const testRoutes = require('./api/test.routes');

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());

app.use('/api/test', testRoutes);

app.listen(app.get('port'), () => {
    console.log(`App is listening on ${app.get('port')}`);
});