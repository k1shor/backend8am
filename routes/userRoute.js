
const express = require('express')

const { addUser, signin, signout, verifyUser, resendConfirmation, forgetPassword, resetPassword, usersList, userDetails, updateUser, removeUser } = require("../controller/userController")
const router = express.Router()


router.post('/register',addUser)
router.post('/signin',signin)
router.get('/signout',signout)
router.get('/confirm/:token',verifyUser)
router.post('/resendconfirmation',resendConfirmation)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.get('/userslist',usersList)
router.get('/userdetails/:user_id',userDetails)
router.put('/update/user/:user_id',updateUser)
router.delete('/delete/user/:user_id',removeUser)

module.exports = router