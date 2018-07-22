const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const userRoutes = require('./api/user.routes');
const loginRoutes = require('./api/login.routes');

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);

app.listen(app.get('port'), () => {
    console.log(`App is listening on ${app.get('port')}`);
});