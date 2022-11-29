const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");

module.exports.createOrder = async (customer, requestBody) => {

	if (customer.isAdmin) {
		
		let message = Promise.resolve(`Admin cannot create order.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}else{

		
			let newOrder = new Order({
				userId: customer.userId,
				customerName: customer.fullName,
				itemCount: requestBody.itemCount,
				deliveryAddress: requestBody.deliveryAddress,
				deliveryMode: requestBody.deliveryMode,
				deliveryFee: requestBody.deliveryFee,
				paymentMode: requestBody.paymentMode,
				totalAmount: requestBody.totalAmount
			}); 

		
			for(let x = 0; x < requestBody.products.length; x++){
				

				newOrder.products.push({
					// PUSH PRODUCT DETAILS TO ARRAY
					productName: requestBody.products[x].productName,
					productPrice: requestBody.products[x].productPrice,
					quantity: requestBody.products[x].quantity,
					// COMPUTE FOR SUBTOTAL: PER PRODUCT
					subtotal: requestBody.products[x].subtotal
				})		
			};



		
			return newOrder.save()
			.then((newOrder, error) => {
				if(error){
					return {
						status: false,
						message: `Error encountered during checkout.`
					}
				}else{
					return {
						status: true,
						message: `Items successfully checked out.`,
						orderId: newOrder.id
					}
				}
			});
	}

};

module.exports.getMyOrders = (customer) => {
	if (customer.isAdmin) {
		let message = Promise.resolve(`Sorry. Admin users must not have order.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}else{
	
		return Order.find({ userId : customer.userId })
		.then(result => {
			if (result.length === 0) {
				return {
					status: false,
					message: `No orders found for ${customer.fullName}.` 
				}
			}else{
				return {
					status: true,
					orderCount: result.length,
					details: result
				}
			}
		})
	}
};



module.exports.getAllOrders = (isAdmin) => {
	
	if (isAdmin) {
		return Order.find({})
		.then(orders => {
			return `Total Number of Orders: ${orders.length}\n${orders}`;
		});
	}else{
		
		let message = Promise.resolve(`Sorry. Only admins can retrieve all orders`);

		return message.then((value) => {
			return value;
		});
	}

};
