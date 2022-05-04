// exports.showInfo = (req, res)=>{
//     res.send('This is from controller')
// }


const Category = require('../model/category')

// to insert data in category
exports.postCategory = async(req,res) =>{
    let category = new Category(req.body)

    Category.findOne({category_name:category.category_name},async (error,data)=>{
        if(data==null){
            category = await category.save()
            if(!category){
                return res.status(400).json({error:"Something went wrong"})
            }
            else{
                res.send(category)
            }
        }
        else{
            return res.status(400).json({error:"Category already exists."})
        }
        
    })     

}

// to get all the categories from database
exports.getCategories = async(req,res) =>{
    let category = await Category.find()
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(category)
}

// to get particular category
exports.findCategory = async(req, res) =>{
    let category = await Category.findById(req.params.id)
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(category)
}

// to update a category
exports.updateCategory = async(req,res) =>{
    let category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name: req.body.category_name
        },
        {
            new:true
        }
    )
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(category)
}

// to remove a category
exports.deleteCategory = (req,res) =>{
    Category.findByIdAndRemove(req.params.category_id)
    .then((category)=>{
        if(!category){
            return res.status(400).json({error:"Category not found"})
        }
        else{
            res.status(200).json({msg:"Category deleted successfully."})
        }
    })
    .catch(error=>res.status(400).json({error:"Something went wrong."}))
}