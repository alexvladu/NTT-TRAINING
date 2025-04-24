const express=require('express');
const authController=require('../controllers/authController');
const viewController=require('../controllers/viewController');
const router=express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLogin);

module.exports=router;