import express from 'express';
import * as authController from '../controllers/auth';

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/signup', authController.postSignup);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

export default router;
