// orderitems(array), user, shipping, total, status, 
// phone number 

const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    total:{
        type: Number,
        required: true
    },
    user:{
        type: ObjectId,
        ref: 'User',
        required: true
    },
    shipping_address:{
        type: String,
        required: true
    },
    shipping_address2:{
        type: String
    },
    phone:{
        type:String,
        required: true
    },
    status:{
        type: String,
        default: 'pending',
        required:true
    },
},{timestamps:true})


module.exports = mongoose.model("Order",orderSchema)