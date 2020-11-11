const express = require('express')
const router = express.Router()

//*Validation
const {
     validRegister,
     validLogin,
     forgotPasswordValidator,
     resetPasswordValidator
} = require('../helpers/valid')


//*Load Controllers
const {
     registerController,
     activationController,
     loginController,
     forgotPasswordController,
     resetPasswordController,
     googleController,
     facebookController
     } = require('../controllers/auth.controller.js')


router.post('/register', validRegister, registerController)
router.post('/login', validLogin, loginController)
router.post('/activation',  activationController)
router.post('/password/forgot', forgotPasswordValidator, forgotPasswordController)
router.post('/password/reset', resetPasswordValidator, resetPasswordController)
router.post('/googlelogin', googleController)
router.post('/facebooklogin', facebookController)

module.exports = router