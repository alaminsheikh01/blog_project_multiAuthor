const {body} = require('express-validator')
const User = require('../../models/User')

module.exports = [
    body('username')
      .isLength({ min:4, max:15 })
      .withMessage('Username Must Be Btween 4 to 15 Charts')
      .custom(async username =>{

          let user = await User.findOne({ username })
          if(user) {
              return Promise.reject('Username Already Used')
          }
      }).trim(),
    body('email')
     .isEmail().withMessage('Please Provide A Valid Email')  
     .custom(async email =>{
        let user = await User.findOne({ email })
        if(user) {
            return Promise.reject('Email Already Used')
        }
     }).normalizeEmail(),

     body('password')
        .isLength({ min: 5 }).withMessage('Your password Must be greater than 5 chars'),
     
     body('confirmPassword')
        .isLength({ min: 5 }).withMessage('Your password Must be greater than 5 chars')
        .custom((confirmpassword, {req }) =>{
            if(confirmpassword != req.body.password){
                throw new Error('password does not match')
            }
            return true
        })    
]