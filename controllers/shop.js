import Product from '../models/product';
import Cart from '../models/cart';


const getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

const getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products',
    });
  });
};

const getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, product => res.render('shop/product-detail', {
    product,
    pageTitle: product.title,
    path: '/products',
  }));
};

const getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(product => {
      const cartProducts = [];
      product.map(el => {
        const prod = cart.products.find(item => item.id === el.id);
        if (prod) {
          cartProducts.push({ productData: el, qty: prod.qty });
        }
      });
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts,
      });
    });
  });
};

const postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, +product.price);
  });
  res.redirect('/cart');
};

const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    console.log(product);
    Cart.deleteProduct(product.id, product.price);
    res.redirect('/cart');
  });
};

const getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

export {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  getCheckout,
};
