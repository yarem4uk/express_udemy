import mongoose from 'mongoose';

import app from './application';

const port = 4000;

mongoose
  .connect('mongodb+srv://alex:ljhjnjk@test-nfrsn.mongodb.net/shop?retryWrites=true&w=majority')
  .then(result => {
    app().listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
    console.log('connected!');
  })
  .catch(err => console.log(err));
