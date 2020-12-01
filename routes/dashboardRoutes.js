const router = require('express').Router()
const {isAuthenticated} = require('../middleware/authMiddleware')
const profileValidator = require('../validator/dashboard/profileValidator')

const {
    dashboardGetController,
    createProfileGetController,
    createProfilePostControllers,
    editProfileGetControllers,
    editProfilePostControllers,
    bookmarksGetController

} = require('../controllers/dashboardControllers')

router.get('/bookmarks', isAuthenticated, bookmarksGetController)

router.get('/create-profile', isAuthenticated, createProfileGetController)
router.post('/create-profile', isAuthenticated, profileValidator, createProfilePostControllers)

router.get('/edit-profile', isAuthenticated, editProfileGetControllers)
router.post('/edit-profile', isAuthenticated, profileValidator, editProfilePostControllers)

router.get('/',isAuthenticated, dashboardGetController)

module.exports = router