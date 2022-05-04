const {check, validationResult} = require('express-validator')

exports.productValidationSchema = [
    check('product_name','product name is required').notEmpty(),
    check('product_price','product price is required').notEmpty()
    .isNumeric().withMessage('price must be a number'),
    check('product_description', 'description is required').notEmpty()
    .isLength({min:20}).withMessage('description must be at least 20 characters'),
    check('count_in_stock','count in stock is required').notEmpty()
    .isNumeric().withMessage('count must be a number'),
    check('category','category is required').notEmpty()
]

exports.productValidationMethod = (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object 
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array()[0].msg
        // //to show all errors:
        // err.array()
        // .map(error=>
        //   {return `${error.msg} at ${error.param}`}
        //   ) 
        });
    }
    next()
}