const {body} = require('express-validator')
const cheerio = require('cheerio')

module.exports = [
    body('title') 
         .not().isEmpty().withMessage('title can not be empty')
         .isLength({ max: 100 }).withMessage('title can not be grater than 100 chars')
         .trim()
     ,
     body('body')
         .not().isEmpty().withMessage('body can not be empty')
         .custom(value => {
             let node = cheerio.load(value)
             let text = node.text()

             if(text.length > 5000){
                 throw new Error('body can not be grater than 5000 chars')
             }
             return true
         })  
]