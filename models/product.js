import mongodb from 'mongodb';
import { getDb } from '../util/database';

export default class Product {

  constructor(title, imageUrl, description, price, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.colleciton('products')
        .insertOne(this);
    }
    return dbOp
      .then(result => result)
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => products)
      .catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then(product => product)
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then(result => result)
      .catch(err => console.log(err));
  }

}
