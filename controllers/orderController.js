const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Order = require("../models/Order.js");
const User = require("../models/User.js");

module.exports.createOrder = (userId, isAdmin, reqBody) => {
	const userData = User.findById(userId);
	const getProduct = Product.findById(productId);
	if (isAdmin) {
		const message = Promise.resolve("Admin cannot create order.");

		return message.then((value) => {
			return value;
		});
	}else{
		let newOrder = new Order({
			userId: userData.userId,
			firstName: userData.firstName,
			lastName: userData.lastName,
			products: [{
				productId: getProduct.productId,
				productName: getProduct,productName,
				quantity: getProduct.quantity
			}],
			totalAmount: getProduct.totalAmount
		})

		return newOrder.save()
		.then((newOrder, error) => {
			if (error) {
				return "Failed to create new order.";
			}else{
				return "Order successfully created.";
			}
		});
	}

};