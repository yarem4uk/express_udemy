import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendGrid from 'nodemailer-sendgrid-transport';

import User from '../models/user';

let resetUser;

const transporter = nodemailer.createTransport(sendGrid({
  auth: {
    api_key: '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',
  },
}));

const getLogin = (req, res, next) => {
  const message = req.flash('error');
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    // isAuthenticated: false,
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

const getSignup = (req, res, next) => {
  const message = req.flash('error');
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Login',
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

const getNewPassword = (req, res, next) => {
  const { token } = req.params;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      const message = req.flash('error');
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'Set new password',
        passwordToken: token,
        userId: user._id.toString(),
        errorMessage: message.length > 0 ? message[0] : null,
      });
    })
    .catch(err => console.log(err));
};

const getReset = (req, res, next) => {
  const message = req.flash('error');
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Password Reset',
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
  // User.findById('5d1dda881e1df2260277152a')
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
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

const postSignup = (req, res, next) => {
  const {
    name,
    email,
    password,
    // confirmPassword,
  } = req.body;
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-mail exists already, please pick a different one');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPass => {
          const user = new User({
            name,
            email,
            password: hashedPass,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
          return transporter.sendMail({
            to: 'yarem4uk@gmail.com',
            from: 'shop@node-complete.com',
            subject: 'SignUp Succeeded!',
            html: `<h1> ${name} You succesfully signed up!</h1>`,
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

const postReset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error, 'this is error');
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found!');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: 'yarem4uk@gmail.com',
          from: 'shop@node-complete.com',
          subject: 'Password Reset.',
          html: `
          <p>You requested password reset</p>
          <p>click this <a href="http://localhost:4000/reset/${token}">link</a> to set new password.</p>
          `,
        });
      })
      .catch(err => console.log(err));
  });
};

const postNewPassword = (req, res, next) => {
  const { newPassword, userId, passwordToken } = req.body;
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
};


export {
  getLogin,
  getSignup,
  getReset,
  getNewPassword,
  postLogin,
  postLogout,
  postSignup,
  postReset,
  postNewPassword,
};
