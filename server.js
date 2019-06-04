const express = require('express');
const connectDB = require('./config/db');
const path = require('path')

const app = express();

//Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }))

//Configuration for Express to behave correctly in production environment
if (process.env.NODE_ENV === 'production') {
    //First - Making sure express will serve production assets - main.js, main.css, etc
    app.use(express.static('client/build'));
    //Second -Express will serve up the index.html file if it doesn't recognize the route
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
};

//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`Motha Fuckin Serva Started On ${PORT}`));

