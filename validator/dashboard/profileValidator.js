const {body} = require('express-validator')
const validator = require('validator')

const linkValidator = value =>{
    if(value) {
        if(!validator.isURL(value)){
            throw new Error('Please Provide Valid URL')
        }
    }
    return true
} 

module.exports =[
    body('name')
         .not().isEmpty().withMessage('Name Can Not Be Empty')
         .isLength( { max: 15 })
         .withMessage('Name Can not be more than 15 chars')
         .custom(async name =>{

            let user = await User.findOne({ name })
        }).trim()
     ,
     body('title')
          .not().isEmpty().withMessage('Title can not be Empty')
          .isLength({ max: 100 }).withMessage('Title can not be more than 100 chars')   
          .trim()
     ,
     body('bio')
          .not().isEmpty().withMessage('Bio can not be Empty')
          .isLength({ max: 500 }).withMessage('Bio can not be more than 500 chars')
          .trim()
     ,
     body('websits')
          .custom(linkValidator)
     , 
     body('facebook')
           .custom(linkValidator)
     ,
     body('twitter')
           .custom(linkValidator)
     ,
     body('github')
           .custom(linkValidator)
     ,               
]
