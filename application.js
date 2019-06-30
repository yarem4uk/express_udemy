import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import shopRoutes from './routes/shop';
import adminRouter from './routes/admin';
import get404 from './controllers/error';

export default () => {

  const app = new Express();

  app.set('view engine', 'ejs');
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/assets', Express.static(path.join(__dirname, 'public')));

  app.use('/admin', adminRouter);
  app.use(shopRoutes);
  app.use(get404);

  return app;
};
