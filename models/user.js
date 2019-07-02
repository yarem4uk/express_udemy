import mongodb from 'mongodb';
import { getDb } from '../util/database';


export default class User {

  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users')
      .insertOne(this)
      .then(result => result)
      .catch(err => console.log(err));
  }

  addToCart(product) {
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items
      .findIndex(cp => cp.productId.toString() === product._id.toString());

    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity += 1;
    } else {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db.collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } },
      )
      .then(result => result)
      .catch(err => console.log(err));

  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => item.productId);
    console.log(productIds);
    return db.collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return { ...p, quantity: this.cart.items
            .find(el => el.productId.toString() === p._id.toString()).quantity };
        });
      })
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