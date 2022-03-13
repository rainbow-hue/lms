const { Router } = require('express');
const authController = require('../controllers/authController')


const router = Router();

router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/logout',authController.logout_get);

//course:
router.get('/compcourse',authController.compcourse_get);
router.get('/cppcourse',authController.cppcourse_get);
router.get('/madcourse',authController.madcourse_get);


//profile:
router.get('/profile',authController.profile_get);
router.put('/profile',authController.profile_put);

router.get('/addtask',authController.addtask_get);
router.post('/addtask',authController.addtask_post);

router.delete('/usertasks/:id',authController.delete_task);
router.put('/usertasks/:id',authController.update_task);

module.exports = router;