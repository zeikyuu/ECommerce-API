const bcrypt = require("bcrypt");
const auth = require("../auth.js");

const Order = require("../models/Order.js");
const Product = require("../models/Product.js");

module.exports.createOrder = async (customer, requestBody) => {

	if (customer.isAdmin) {
	
		let message = Promise.resolve(`Admin cannot create order.`);

		return message.then((value) => {
			return value;
		});
	}else{
			let newOrder = new Order({
				userId: customer.userId,
				customerName: customer.fullName
			}); 

			for(let x = 0; x < requestBody.products.length; x++){

			
				await Product.findById(requestBody.products[x].productId)
				.then(result => {

					newOrder.products.push({
						
						productId: requestBody.products[x].productId,
						productName: result.name,
						productPrice: result.price,
						quantity: requestBody.products[x].quantity,
						
						subtotal: result.price*requestBody.products[x].quantity
					})
				
					newOrder.totalAmount += result.price*requestBody.products[x].quantity;
				})
			};

			return newOrder.save()
			.then((newOrder, error) => {
				if(error){
					return `Error in creating order.`;
				}else{
					return `New order for (${newOrder.customerName}) was successfully created\nOrder Details:\n${newOrder.products}\n\nTotal Amount of Order: ${newOrder.totalAmount}`;
				}
			});
	}

};


module.exports.getMyOrders = (customer) => {
	if (customer.isAdmin) {
		let message = Promise.resolve(`Sorry. Admin users must not have order.`);

		return message.then((value) => {
			return value;
		});
	}else{

		return Order.find({ userId : customer.userId })
		.then(result => {
			if (result.length === 0) {
				return `User (${customer.fullName}) does not have any orders yet.`;
			}else{
				return `User (${customer.fullName}) has ${result.length} order\\s:\n${result}`;
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
