import fs from 'fs';
import path from 'path';
import rootDir from '../util/path';
import Cart from './cart';


const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(p, 'utf8', (err, data) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  });
};

export default class Product {

  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        console.log('hello from save method');
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), error => {
          if (error) {
            console.log(error);
            throw error;
          }
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), error => {
          if (error) {
            console.log(error);
            throw error;
          }
        });
      }
    });
  }

  static deleteById(prodId) {
    Product.fetchAll(products => {
      const product = products.find(item => item.id === prodId);
      const updatedProducts = products.filter(item => item.id !== prodId);
      fs.writeFile(p, JSON.stringify(updatedProducts), error => {
        if (!error) {
          Cart.deleteProduct(prodId, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(el => el.id === id);
      cb(product);
    });
  }

}
