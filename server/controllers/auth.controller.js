const User = require('../models/auth.model')
const expressJwt
///({secret: process.env.JWT_SECRET, algorithms: ['sha1', 'RS256', 'HS256']}) 
= require('express-jwt')
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')
const fetch = require('node-fetch')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
//const crypto = require('crypto')
//*Custom error handler to get useful error from database errors
const {errorHandler} = require('../helpers/dbErrorhandling')

//* Use sendgrid to send email
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.MAIL_KEY)

//*Register
exports.registerController = (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);


    //*Validation to req,body
    if (!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            errors: firstError
        })
    } else{
        User.findOne({
            email
        }).exec((err,user)=>{
            //if user exists
            if(user){
                return res.status(400).json({
                    error: "Email is taken"
                })
            }
        })
    //*Generate Token
    const token = jwt.sign(
        {
            name,
            email,
            password
        },
        process.env.JWT_ACCOUNT_ACTIVATION,
        {
            expiresIn: '5m'
        }
    )
    //* Email Data Sending
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Account activation link',
        html: `
            <h1>Please Click link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
            <hr/>
            <p>This email contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `
    };
    sgMail
        .send(emailData)
        .then(sent => {
            return res.json({
                message: `Email has been sent to ${email}`
         })
        })
    .catch(err =>{
        console.log(err)
        return res.status(400).json({
            success: false,
            message: 'confirmation email sending error',
            error: errorHandler(err)
            })
        })


    }
}

//* Register For backend done


//* Activation and save to database
exports.activationController = (req, res) => {
    const { token } = req.body;
    console.log("Token", token)
    if (token) {
        //Verify the token is valid or not or expired
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
            if (err) {
                console.log('Activation error');
                return res.status(401).json({
                    errors: 'Expired Token. Signup again'
                });
            } else {
                //if valid save to database
                //Get name, email, password from token
                const { name, email, password } = jwt.decode(token);
                //const hashed_password = encyptPassword(password)
                console.log("Email", email);
                const user = new User({
                    name,
                    email,
                    password
                });

                user.save((err, user) => {
                    if (err) {
                        console.log('Save error', err);
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    } else {
                        return res.json({
                            success: true,
                            message: 'Signup success',
                        });
                    }
                });
            }
        });
    } else {
        return res.json({
            
            message: 'error happening please try again error from activation'

        });
    }
};
//*encryt password
//function encyptPassword(password) {
    //if (!password) return ''
    ///try {
        //const hashed_password = crypto
          //  .createHmac('sha1', 'KELVINBOY')
          ///  .update(password)
          //  .digest('hex')
          //  console.log("Hashed Password", hashed_password)
           // return hashed_password
    //} catch (err) {
     //  console.log("Encryption error", err)
    //}
//}

//* Login
exports.loginController = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    //Validation to req,body to create custom validation

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        // check if user exist
        User.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    errors: 'User with that email does not exist. Please signup'
                });
            }
            // authenticate
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    errors: 'Email and password do not match'
                });
            }
            // generate a token and send to client
            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            );
            const { _id, name, email, role } = user;

            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    role
                }
            });
        });
    }
};

//*Adminlogin
exports.requireSignin = expressJwt({secret: process.env.JWT_SECRET, algorithms: ['sha1', 'RS256', 'HS256']});

exports.adminMiddleware = (req, res, next) => {
    User.findById({
        _id: req.user._id
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }

        req.profile = user;
        next();
    });
};

//* Forgot Password
exports.forgotPasswordController = (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        User.findOne(
            {
                email
            },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'User with that email does not exist'
                    });
                }
                //if user exist, generate token with this id for only 10minutes
                const token = jwt.sign(
                    {
                        _id: user._id
                    },
                    process.env.JWT_RESET_PASSWORD,
                    {
                        expiresIn: '10m'
                    }
                );
                    // send email with this token
                const emailData = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: `Password Reset link`,
                    html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
                };

                return user.updateOne(
                    {
                        resetPasswordLink: token
                    },
                    (err, success) => {
                        if (err) {
                            console.log('RESET PASSWORD LINK ERROR', err);
                            return res.status(400).json({
                                error:
                                    'Database connection error on user password forgot request'
                            });
                        } else {
                            sgMail
                                .send(emailData)
                                .then(sent => {
                                    // console.log('SIGNUP EMAIL SENT', sent)
                                    return res.json({
                                        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                                    });
                                })
                                .catch(err => {
                                    // console.log('SIGNUP EMAIL SENT ERROR', err)
                                    return res.json({
                                        message: err.message
                                    });
                                });
                        }
                    }
                );
            }
        );
    }
};


//*Reset Password
exports.resetPasswordController = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        if (resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
                err,
                decoded
            ) {
                if (err) {
                    return res.status(400).json({
                        error: 'Expired link. Try again'
                    });
                }

                User.findOne(
                    {
                        resetPasswordLink
                    },
                    (err, user) => {
                        if (err || !user) {
                            return res.status(400).json({
                                error: 'Something went wrong. Try later'
                            });
                        }

                        const updatedFields = {
                            password: newPassword,
                            resetPasswordLink: ''
                        };

                        user = _.extend(user, updatedFields);

                        user.save((err, result) => {
                            if (err) {
                                return res.status(400).json({
                                    error: 'Error resetting user password'
                                });
                            }
                            res.json({
                                message: `Great! Now you can login with your new password`
                            });
                        });
                    }
                );
            });
        }
    }
};


//*GoogleLogin
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

exports.googleController = (req, res) => {
    const { idToken } = req.body;

    client
        .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
        .then(response => {
            // console.log('GOOGLE LOGIN RESPONSE',response)
            const { email_verified, name, email } = response.payload;
            if (email_verified) {
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with google'
                                });
                            }
                            const token = jwt.sign(
                                { _id: data._id },
                                process.env.JWT_SECRET,
                                { expiresIn: '7d' }
                            );
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    error: 'Google login failed. Try again'
                });
            }
        });
};


//*FacebookLogin
exports.facebookController = (req, res) => {
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;
    //Get id and token from React
    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
    //get from facebook
    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => {
                //Get email and password from facebook
                const { email, name } = response;
                User.findOne({ email }).exec((err, user) => {
                    //Check if this account with this email already exists
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        //generate password and save to database as new user
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            //if no error
                            const token = jwt.sign(
                                { _id: data._id },
                                process.env.JWT_SECRET,
                                { expiresIn: '7d' }
                            );
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });  
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );
};