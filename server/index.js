const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const  {googleAuth}  = require('./routes/googleAuth');


// set a life time and encrypt our cookie
app.use(
        cookieSession({
        maxAge:30*24*60*60*1000,
        keys:[keys.cookieKey]}));


    // use cookies to manage our auth
    app.use(passport.initialize());

    app.use(passport.session());
    
       googleAuth(app);




mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Database connected'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
});