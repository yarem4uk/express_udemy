import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import shopRoutes from './routes/shop';
import adminRouter from './routes/admin';
import get404 from './controllers/error';

import User from './models/user';

export default () => {

  const app = new Express();

  app.set('view engine', 'ejs');
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/assets', Express.static(path.join(__dirname, 'public')));

  app.use((req, res, next) => {
    User.findUserById('5d18c73f1c9d44000029a927')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

  app.use('/admin', adminRouter);
  app.use(shopRoutes);
  app.use(get404);

  return app;
};
