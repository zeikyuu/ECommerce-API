const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const User = require("../models/User.js");
const auth = require("../auth.js");
const mongoose = require("mongoose")


module.exports.createOrder = async (data) => {

if(!data.isAdmin){
	return isProductUpdated = await Product.findById(data.productId).then(product => {

		if(!product.isActive) {
					return "Product is not available."
			
		} else {
			

			let newOrder = new Order({
		userId : data.userId,
		products : [{
			productId: data.productId,
			quantity : data.quantity

		}],
		totalAmount: product.price * data.quantity

	})

			return newOrder.save().then((newOrder, error) => {
				if(error){
					return "Error. Try Again."
				}
				return "Order successfully created!"
			})
			
	}

	return product.save().then((product, error) => {
		if (error){
			return "Order successfully created!"
		} 
			return "Error occured please try again."
	})
		})

} else {
	let message = Promise.resolve("Admins are not allowed to perform this action.")

	return message.then((value) => {
		return value
	})


}

}

module.exports.getAllOrders = () => {
	return Order.find({}).then(result => {
		return result
	})
}












