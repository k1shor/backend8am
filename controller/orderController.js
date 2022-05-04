const Order = require('../model/order')
const OrderItem = require('../model/orderItem')

exports.placeOrder = async(req,res) =>{
    const orderItemIds = await Promise.all(
        req.body.orderItems.map(
            async(orderItem)=>{
                let newOrderItem = new orderItem({
                    product : orderItem.product,
                    quantity: orderItem.quantity
                })
                newOrderItem = await newOrderItem.save()
                return newOrderItem._id
            }
        )
    )

    // calculating individual total prices
    const individualTotalPrices = await Promise.all(orderItemIds.map(async(orderItemId)=>{
        const order = await OrderItem.findById(orderItemId).populate('product','product_price')
        const total = order.quantity*order.product.product_price
        return total
    }
    ))
// calculating total price of order
    const totalPrice = individualTotalPrices.reduce((acc, cur)=>acc+curr)

    let order = new Order({
        orderItems: orderItemIds,
        total : totalPrice,
        user: req.body.user,
        shipping_address: req.body.shipping_address,
        shipping_address2: req.body.shipping_address2,
        phone: req.body.phone,        
    })
    order = await order.save()
    if(!order){
        return res.status(400).json({error:"order could not be placed"})
    }
    res.send(order)



}

// samsung phone - 5 , 30000 
// asus laptop - 3, 100000
// dell mouse - 12, 500
// individualTotalPrices = [5*30000, 3*100000, 12*500]
// sum = arr.reduce((acc, curr)=>acc+curr)
// acc = 5*30000 = 150000
// curr = 3*100000 = 300000
// sum = acc + cur = 450000
// acc = sum, 450000
// curr = 12*500 = 6000
// sum = acc + curr = 450000+6000 = 456000