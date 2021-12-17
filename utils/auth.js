const withAuth = (req, res, next) => {
    if(Qreq.session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAuth;