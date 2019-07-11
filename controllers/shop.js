import Product from '../models/product';
import Order from '../models/order';

const getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log(err));
};

const getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log(err));
};

const getCart = (req, res, nex) => {
  console.log(req.user, 'user from session getCart');
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      res.render('shop/cart', {
        products: user.cart.items,
        pageTitle: 'Your cart',
        path: '/cart',
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log(err));
};

const getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(product => res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
      // isAuthenticated: req.session.isLoggedIn,
    }))
    .catch(err => console.log(err));
};

const postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => {
      req.user.addToCart(product);
    })
    .then(() => {
      console.log('Cart was updated!');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(resutl => {
      console.log('deleted!');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

const postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: { ...i.productId._doc },
        };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(result => {
      req.user.clearCart();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        orders,
        pageTitle: 'Your Orders',
        path: '/orders',
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log(err));
};

export {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getOrders,
};
