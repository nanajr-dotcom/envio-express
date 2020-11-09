const User = require('../models/auth.model')
const expressJwt = require('express-jwt')
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')
const fetch = require('node-fetch')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
//*Custom error handler to get useful error from database errors
const {errorHandler} = require('../helpers/dbErrorhandling')

//* Use sendgrid to send email
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.MAIL_KEY)

exports.registerController = (req, res) => {
    const {name, email, password } = req.body;
    const errors = validationResult(req);


    //*Validation to req,body
    if (!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
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
            <h1>Please Click link to activate</h1>
            <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
            <hr/>
            <p>This email contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `
    }
    sgMail
        .send(emailData)
        .then(sent => {
            return res.json({
                message: `Email has been sent to ${email}`
         })
        })
    .catch(err =>{
        console.log('error');
        return res.status(400).json({
            success: false,
            error: errorHandler(err)
            })
        })


    }
}

//* Register For backend done


//* Activation and save to database
exports.activationController = (req, res) => {
    const { token } = req.body;

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

                console.log(email);
                const user = new User({
                    name,
                    email,
                    password
                });

                user.save((err, user) => {
                    if (err) {
                        console.log('Save error', errorHandler(err));
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    } else {
                        return res.json({
                            success: true,
                            message: 'Signup success',
                            user
                        });
                    }
                });
            }
        });
    } else {
        return res.json({
            message: 'error happening please try again'
        });
    }
};