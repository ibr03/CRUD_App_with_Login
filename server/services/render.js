
// Login page
exports.login =  (req, res) => {
    res.render('Login');
}

// Register page
exports.register = (req, res) => {
    res.render('Register');
}

exports.add_user = (req, res) => {
    res.render('add_update_user', { title: "Add User", user: req.body });
}

exports.update_user = (req, res) => {
    res.render('add_update_user', { title: "Update User", user: req.body});
}