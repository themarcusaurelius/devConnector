//Mongo DB Connection
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    //Try block incase there is an error
    try {
        await mongoose.connect(db, { 
            useNewUrlParser: true, 
            useCreateIndex: true,
            useFindAndModify: false
        });
        
        console.log('mongoDB Connected')
    } catch (err) {
        console.log(err.message)
        //Exit process with failure
        process.exit(1)
    }
};

module.exports = connectDB;