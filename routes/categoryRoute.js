const express = require('express')
const router = express.Router()
const {postCategory, getCategories, findCategory, updateCategory, deleteCategory} = require('../controller/categoryController')
const { requireSignin } = require('../controller/userController')
const { categoryValidationSchema, categoryValidationMethod } = require('../validation/categoryValidation')


router.post('/addcategory',requireSignin,categoryValidationSchema,categoryValidationMethod,postCategory)
router.get('/categories',getCategories)
router.get('/findcategory/:id',findCategory)
router.put('/updatecategory/:id',updateCategory)
router.delete('/deletecategory/:category_id',deleteCategory)

module.exports = router