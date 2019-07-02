import Product from '../models/product';

const getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => console.log(err));
};

const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

const getCart = (req, res, nex) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        products,
        pageTitle: 'Your cart',
        path: '/cart',
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
  // postCartDeleteProduct,
  getOrders,
  getCheckout,
};
