mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    city: {
        type: String
    }
})

// Custom validation for email, regex taken from https://www.w3resource.com/javascript/form/email-validation.php
schema.path('email').validate((val) => {
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(val);
}, 'Invalid e-mail');

// Validation for 10 digit phone numbers
schema.path('phone').validate((val) => {
    phoneRegex = /^([0-9]{10}$)/;
    return phoneRegex.test(val);
}, 'Invalid phone number');

const userdb = mongoose.model('userdb', schema);

module.exports = userdb;