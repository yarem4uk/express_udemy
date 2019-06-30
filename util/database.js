import { MongoClient } from 'mongodb';

let _db;

export const mongoConnect = callback => {
  MongoClient.connect('mongodb+srv://alex:ljhjnjk@shop-nfrsn.mongodb.net/test?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  const errStr = 'No base found!';
  throw errStr;
};
