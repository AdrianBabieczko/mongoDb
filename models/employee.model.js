const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String, require: true }
});

module.exports = mongoose.model('Employee', employeeSchema);