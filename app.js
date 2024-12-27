require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const salesrepCntrl = require('./controllers/salesrep');

// Define a port number
const PORT = process.env.PORT || 3000;;

//DB STRING & COnnection
const mongoURI = process.env.DB_URI;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));
//END DB STRING & COnnection


//Routes
app.get('/countries', salesrepCntrl.countries);
app.get('/salesrep', salesrepCntrl.salesrep);
app.get('/optimal', salesrepCntrl.optimal);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});