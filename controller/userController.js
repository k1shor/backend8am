const User = require('../model/userModel')
const Token = require('../model/token')
const jwt = require('jsonwebtoken')
const sendEmail = require('../middleware/sendEmail')
const crypto = require('crypto')
const expressJWT = require('express-jwt')



exports.addUser = async (req, res) => {
    User.findOne({ email: req.body.email }, async (error, user) => {
        if (!user) {
            let user = new User({
                user_name: req.body.user_name,
                email: req.body.email,
                password: req.body.password

            })
            user = await user.save()
            if (!user) {
                return res.status(400).json({ error: "something went wrong" })
            }
            let token = new Token({
                token: crypto.randomBytes(16).toString('hex'),
                userId: user._id
            })
            token = await token.save()
            if (!token) {
                return res.status(400).json({ error: "something went wrong" })
            }
            // else{
            sendEmail({
                from: 'no-reply@mystore.com',
                to: req.body.email,
                subject: "Verification Email",
                text: `Please click on the following link to verify.
                    \n\n http://${req.headers.host}\/\/api\/confirm\/${token.token}`,
                html: `<a href='http://${req.headers.host}\/api\/confirm\/${token.token}'><button>Verify Account</button></a>`
            })
            // }

            res.send(user)
        }
        else {
            return res.status(400).json({ error: "Email already exists. Login to continue or choose different email." })

        }
    })
}

// verify email
exports.verifyUser = async (req, res) => {
    // find token
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "invalid token or token may have expired" })
    }
    // if token is found, find user
    let user = await User.findOne({ _id: token.userId })
    if (!user) {
        return res.status(400).json({ error: " user not found, please register" })
    }
    // if user is found, check if already verified
    if (user.isVerified) {
        return res.status(400).json({ error: " user already verified, please login to continue" })
    }
    // if not verified, verify user
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "something went wrong" })
    }
    return res.status(200).json({ message: "user verified successfully" })
}


//signin process
exports.signin = async (req, res) => {
    // destructuring object from body
    const { email, password } = req.body

    // check if email exists or not
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ error: "Email does not exist. Please try again with different email address or register to continue." })
    }
    //email exists, check password
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "Email and Password does not match. Please try again." })
    }

    //check if user is verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "User not verified. Please verify your account to continue" })
    }

    // generate token if password and email match
    const token = jwt.sign({ _id: user._id, user: user.role }, process.env.jwt_secret)

    //store information in cookie
    res.cookie('myCookie', token, {
        expire: Date.now() + 84600
    })

    //send information to front end 
    const { _id, user_name, role } = user
    return res.json({ token, user: { user_name, email, role, _id } })
}


//signout
exports.signout = (req, res) => {
    res.clearCookie('myCookie')
    res.json({ message: "logout successful" })
}

// resend confirmation email
exports.resendConfirmation = async (req, res) => {
    // check email if exist or not
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email is not registered. Please register or try different email address." })
    }
    // if email exists, check if user is verified or not
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified. Please login to continue." })
    }
    // if user is not verified, generate token and send email
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "something went wrong" })
    }
    // else{
    sendEmail({
        from: 'no-reply@mystore.com',
        to: req.body.email,
        subject: "Verification Email",
        text: `Please click on the following link to verify.
            \n\n http://${req.headers.host}\/\/api\/confirm\/${token.token}`,
        html: `<a href='http://${req.headers.host}\/api\/confirm\/${token.token}'><button>Verify Account</button></a>`
    })

    res.status(200).json({ message: "Verification link has been sent to your email." })

}

// forget password
exports.forgetPassword = async (req, res) => {
    // check email if exist or not
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email is not registered. Please register or try different email address." })
    }

    // if user is found, generate token and send email
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "something went wrong" })
    }
    // else{
    sendEmail({
        from: 'no-reply@mystore.com',
        to: req.body.email,
        subject: "Password RESET Link",
        text: `Please click on the following link to reset your password.
            \n\n http://${req.headers.host}\/api\/resetpassword\/${token.token}`,
        html: `<a href='http://${req.headers.host}\/api\/resetpassword\/${token.token}'><button>Reset Password</button></a>`
    })

    res.status(200).json({ message: "Password reset link has been sent to your email." })

}

// reset password
exports.resetPassword = async (req, res) => {
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    let user = await User.findOne({ _id: token.userId })
    if (!user) {
        return res.status(400).json({ error: "User does not exist. Please register" })
    }
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.status(200).json({ message: "Password changed successfully." })
}

// to show userlist
exports.usersList = async (req, res) => {
    let users = await User.find()
    if (!users) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(users)
}

// to get user detail
exports.userDetails = async (req, res) => {
    let user = await User.findById(req.params.user_id)
    if (!user) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(user)
}

// to edit/update user
exports.updateUser = async (req, res) => {
    let user = await User.findByIdAndUpdate(req.params.user_id, {
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password
    },
        { new: true })
    if (!user) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(user)
}

// to remove user
exports.removeUser = async (req, res) => {
    let user = await User.findByIdAndRemove(req.params.user_id)
    if (!user) {
        return res.status(400).json({ error: "Could not find user." })
    }
    else {
        res.status(200).json({ message: "User deleted successfully." })
    }
}

// to keep signed in
exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty: 'auth'
})