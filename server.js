import mongoose from 'mongoose';

import app from './application';
// import User from './models/user';

const port = 4000;

mongoose
  .connect('mongodb+srv://alex:ljhjnjk@test-nfrsn.mongodb.net/shop?retryWrites=true&w=majority')
  .then(result => {
    // const user = new User({
    //   name: 'Alex',
    //   email: 'alex@test.com',
    //   cart: {
    //     items: [],
    //   },
    // });
    // user.save();
    app().listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
    console.log('connected!');
  })
  .catch(err => console.log(err));
