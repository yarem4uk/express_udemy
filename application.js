import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

import shopRoutes from './routes/shop';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import get404 from './controllers/error';

import User from './models/user';

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: 'mongodb+srv://alex:ljhjnjk@test-nfrsn.mongodb.net/shop',
  colleciton: 'sessions',
});

export default () => {

  const app = new Express();

  app.set('view engine', 'ejs');
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/assets', Express.static(path.join(__dirname, 'public')));
  app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
  }));

  app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      });
  });

  app.use('/admin', adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes);

  app.use(get404);

  return app;
};
