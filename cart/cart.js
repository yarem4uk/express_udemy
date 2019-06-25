import fs from 'fs';

const p = './data/test.json';

export default class Cart {

  static addProduct(id, price) {
    fs.readFile(p, 'utf8', (err, data) => {
      const cart = JSON.parse(data);
      // const { products, totalPrice } = JSON.parse(data);
      const product = cart.products.find(el => el.id === id);
      if (product) {
        cart.products = cart.products.reduce((acc, item) => {
          if (item.id === id) {
            return acc.concat({ id, qty: item.qty + 1 });
          }
          return acc.concat(item);
        }, []);
      } else {
        cart.products = cart.products.concat({ id, qty: 1 });
      }
      const newCart = { products: cart.products, totalPrice: cart.totalPrice + price };
      fs.writeFile(p, JSON.stringify(newCart), error => {
        if (error) {
          console.log(error);
        }
      });
    });
    return this;
  }

  static showCart() {
    console.log('cart');
  }

}
