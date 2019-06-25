import fs from 'fs';
import path from 'path';
import rootDir from '../util/path';

const p = path.join(rootDir, 'data', 'cart.json');

export default class Cart {

  static getCart(cb) {
    fs.readFile(p, 'utf8', (err, data) => {
      const cart = JSON.parse(data);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }

  static addProduct(id, price) {
    fs.readFile(p, 'utf8', (err, data) => {
      // let cart = { products: [], totalPrice: 0 };
      const cart = JSON.parse(data);
      const product = cart.products.find(el => el.id === id);
      if (product) {
        const index = cart.products.findIndex(el => el.id === id);
        cart.products[index].qty += 1;
      } else {
        cart.products = [...cart.products, { id, qty: 1 }];
      }
      const newCart = { products: cart.products, totalPrice: cart.totalPrice + price };
      console.log(newCart);
      fs.writeFile(p, JSON.stringify(newCart), error => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, 'utf8', (err, data) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(data) };
      const product = updatedCart.products.find(item => item.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(item => item.id !== id);

      updatedCart.totalPrice -= productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), error => {
        if (error) {
          console.log(error);
        }
      });
    });
  }

}
