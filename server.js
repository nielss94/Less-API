const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const userRoutes = require('./api/user.routes');
const loginRoutes = require('./api/login.routes');
const sharedRoutes = require('./api/shared.routes');
const addictionRoutes = require('./api/addiction.routes');
const goalRoutes = require('./api/goal.routes');

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/shared', sharedRoutes);
app.use('/api/addiction', addictionRoutes);
app.use('/api/goal', goalRoutes);

app.listen(app.get('port'), () => {
    console.log(`App is listening on ${app.get('port')}`);
});