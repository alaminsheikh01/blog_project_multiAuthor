const router = require('express').Router()
const signupValidator = require('../validator/auth/signupValidator')
const loginValidator = require('../validator/auth/loginValidator')

const {

    singupGetControllers,
    singupPostControllers,
    loginGetControllers,
    loginPostControllers,
    logoutControllers,
    changePasswordGetController,
    changePasswordPostController
    
    
} = require('../controllers/authControllers')

const {isUnAuthenticated, isAuthenticated} = require('../middleware/authMiddleware')


router.get('/signup',isUnAuthenticated, singupGetControllers)
router.post('/signup',isUnAuthenticated,signupValidator, singupPostControllers)

router.get('/login',isUnAuthenticated, loginGetControllers)
router.post('/login',isUnAuthenticated,loginValidator, loginPostControllers)

router.get('/change-password', isAuthenticated, changePasswordGetController)
router.post('/change-password', isAuthenticated, changePasswordPostController)

router.get('/logout', logoutControllers)

module.exports = router