import mongodb from 'mongodb';
import { getDb } from '../util/database';


export default class User {

  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection('users')
      .insertOne(this)
      .then(result => result)
      .catch(err => console.log(err));
  }

  static findUserById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then(user => user)
      .catch(err => console.log(err));
  }

}
