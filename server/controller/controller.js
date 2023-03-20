const bcrypt = require('bcryptjs');
const passport = require('passport');

// User data
const User = require('../model/User');

// Database
const userdb = require('../model/model');

exports.registerHandle = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields'});
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters long'});
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        }); 
    } else {
        // Validation passed
        User.findOne({ email: email})
        .then(user => {
            if (user) {
                // User exists
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                // Hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed version
                        newUser.password = hash;
                        // Save hash pass in db
                        newUser.save().then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                    })
                })
            }
        })
    }

};

// Login handle
exports.loginHandle = (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/user',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    };

// Logout handle
exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
};

// Create and save new user
exports.create = (req, res) => {
        // new user
        const user = new userdb({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            city: req.body.city
        });

        // save user in db
        user.save()
        .then(data => {
            // redirect to home page
            res.redirect('/user');
        }).catch(err => {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("add_update_user", {
                    title: "Add User",
                    user: req.body
                });
            }
            else {
                console.log('Error during record insertion : ' + err);
            }
        })
}


// Retrieve all users / single user
exports.home = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        userdb.findById(id).then(data => {
                res.render('index', {
                    users: data 
                });
        }).catch(err => {
            res.status(500).send({ message: 'Error retrieving user with id: '+ id});
        })
    } else {
        userdb.find().then(data => {
            res.render('index', {
                users: data });
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Error occurred while retrieving user information.'
            })
        })
    }    
}

// Update user data
exports.update = (req, res) => {

    const id = req.params.id;

    userdb.findByIdAndUpdate(id, req.body, { runValidators: true })
    .then(data => {
            res.redirect('/user');
        }).catch(err => {
        if (err.name == 'ValidationError') {
            handleValidationError(err, req.body);
            res.render("add_update_user", {
                title: "Update User",
                user: req.body
            });
        }
        else {
            console.log('Error during record insertion : ' + err);
        }
    })
}

// Delete user 
exports.delete = (req, res) => {
    const id = req.params.id;

    userdb.findByIdAndDelete(id)
    .then(data => {
        res.redirect('/user');
    }).catch(err => {
        res.status(500).send({
            message: err.message || 'Error occurred while deleting user information.'
        })
    })
}

// Error handling
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'phone':
                body['phoneError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}