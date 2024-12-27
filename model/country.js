const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    name: String,
    region: String
});

const Country = mongoose.model('Country', CountrySchema);

module.exports = Country; 