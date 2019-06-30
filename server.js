import { mongoConnect } from './util/database';

import app from './application';

const port = 4000;

mongoConnect(() => {
  app().listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
});
