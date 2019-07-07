import User from '../models/user';

const getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

const postLogin = (req, res, next) => {
  User.findById('5d1dda881e1df2260277152a')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
      });
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};


export {
  getLogin,
  postLogin,
  postLogout,
};
