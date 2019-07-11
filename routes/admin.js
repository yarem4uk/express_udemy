import express from 'express';
import * as adminController from '../controllers/admin';
import isAuth from '../middleware/is-auth';

const router = new express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product/', isAuth, adminController.postEditProduct);

router.post('/delete-product/', isAuth, adminController.postDeleteProduct);

export default router;
