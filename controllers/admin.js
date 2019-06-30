import Product from '../models/product';

const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

const postAddProduct = (req, res, next) => {
  const {
    title,
    imageUrl,
    description,
    price,
  } = req.body;
  const product = new Product(
    title,
    imageUrl,
    description,
    price,
    null,
    req.user._id,
  );
  product.save()
    .then(result => {
      console.log('created products!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

const postEditProduct = (req, res, next) => {
  const {
    title,
    imageUrl,
    price,
    description,
    productId,
  } = req.body;
  const updatedProduct = new Product(title, imageUrl, description, price, productId);
  updatedProduct.save()
    .then(result => {
      console.log('Product Udated!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  return Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch(err => console.log(err));
};

const postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId)
    .then(resut => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

export {
  getAddProduct,
  getEditProduct,
  postAddProduct,
  postEditProduct,
  postDeleteProduct,
  getProducts,
};
