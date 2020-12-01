const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const User = require('../models/User')
const errorFormatter = require('../utils/validationErrorsFormator')
const Flash = require('../utils/Flash')


exports.singupGetControllers = (req, res, next) =>{

    res.render('pages/auth/signup', 
    {
        title: 'Ceate A New Account', 
        error: {}, 
        value: {},
        flashMessage:Flash.getMessage(req)

    })
  
}

exports.singupPostControllers = async (req, res, next) =>{

    let {username, email, password} = req.body
    
    let errors = validationResult(req).formatWith(errorFormatter)

    
    if(!errors.isEmpty()){
        req.flash('fail', 'Please Check Your Form')
       return res.render('pages/auth/signup', 
       {
           title: 'Ceate A New Account', 
           error:errors.mapped(),
           value: {
               username, email, password
           },
           flashMessage:Flash.getMessage(req)
        })
    }

    try{
      let hashedPassword = await bcrypt.hash(password, 11)

      let user = new User({
        username,
        email,
        password: hashedPassword
    })

         await user.save()
         req.flash('success', 'User Created Succesfully')
         res.redirect('/auth/login')

    }catch(e){
        next(e)
    }
}

exports.loginGetControllers = (req,res, next) =>{

    res.render('pages/auth/login', 
    {
        title: 'Login to Your Account', 
        error: {},
        flashMessage:Flash.getMessage(req)
    })

}

exports.loginPostControllers = async (req,res, next) =>{

    let {email, password} = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

   
    if(!errors.isEmpty()){
        req.flash('fail', 'Please Check Your Form')
       return res.render('pages/auth/login', 
       {
           title: 'Login to Your account', 
           error:errors.mapped(),
           flashMessage:Flash.getMessage(req)
        })
    }

    try{

        let user = await User.findOne({ email })
        if(!user){

            req.flash('fail', 'Please provide valid credentials')
            return res.render('pages/auth/login', 
          {
           title: 'Login to Your account', 
           error:{},
           flashMessage:Flash.getMessage(req)
        })
        }

        let match = await bcrypt.compare(password, user.password)
        if(!match) {

            req.flash('fail', 'Please provide valid credentials')
            return res.render('pages/auth/login', 
            {
             title: 'Login to Your account', 
             error:{},
             flashMessage:Flash.getMessage(req)
          })
        }

        req.session.isLoggedIn= true
        req.session.user = user

        req.session.save(err =>{
            if(err) {
                return next(err)
            }

            req.flash('success' , 'Successfully Logged In')
            res.redirect('/dashboard')
        })
        

    }catch(e){
        next(e)
    }

}

exports.logoutControllers = (req, res, next) =>{

    req.session.destroy(err =>{
        if(err) {
            return next(err)
        }
        return res.redirect('/auth/login')
    })

}

exports.changePasswordGetController =  async (req, res, next) =>{
    res.render('pages/auth/changePassword',{
        title:'Change my password',
        flashMessage: Flash.getMessage(req)
    })
}

exports.changePasswordPostController =  async (req, res, next) =>{

    let {oldPassword, newPassword, confirmPassword} = req.body

    if(newPassword != confirmPassword){
        req.flash('fail', 'password does not match')
       return res.redirect('/auth/change-password')
    }

   try{
    let match = await bcrypt.compare(oldPassword, req.user.password)
   if(!match){
       req.flash('fail', 'Invalid old password')
       return res.redirect('/auth/change-password')
   }
   let hash = await bcrypt.hash(newPassword, 11)
   await User.findOneAndUpdate(
       {_id: req.user._id },
       {$set: { password: hash }}
   )
   req.flash('success', 'Password updated succesfully')
   return res.redirect('/auth/change-password')


   }catch(e){
       next(e)
   }
}