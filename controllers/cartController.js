const bcrypt = require("bcrypt");
const auth = require("../auth.js");

const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

module.exports.addToCart = async (customer, requestBody) => {
	
	if (customer.isAdmin) {
	
		let message = Promise.resolve(`Admin cannot create cart.`);

		return message.then((value) => {
			return value;
		});
	}

	else{
		let existingCart = await Cart.find({userId : customer.userId})
		.then(cart => {
			return cart;
		});
		
		if (existingCart.length === 0) {
			let newCart = new Cart({
				userId: customer.userId,
				customerName: customer.fullName
			})

			for(let x = 0; x < requestBody.products.length; x++){

				
				await Product.findById(requestBody.products[x].productId)
				.then(result2 => {

					newCart.products.push({
						
						productId: requestBody.products[x].productId,
						productName: result2.name,
						productPrice: result2.price,
						quantity: requestBody.products[x].quantity,
						
						subtotal: result2.price*requestBody.products[x].quantity
					})
				
					newCart.totalAmount += result2.price*requestBody.products[x].quantity;
				})
			};

			return newCart.save()
			.then((newCart, error) => {
				if(error){
					return `Error in creating cart.`;
				}else{
					return `New cart for (${newCart.customerName}) was successfully created!`;
				}
			});
		}

	
		else{
		
			for(let x = 0; x < requestBody.products.length; x++){

				await Product.findById(requestBody.products[x].productId)
				.then(result3 => {
					existingCart[0].products.push({
					
						productId: requestBody.products[x].productId,
						productName: result3.name,
						productPrice: result3.price,
						quantity: requestBody.products[x].quantity,
					
						subtotal: result3.price*requestBody.products[x].quantity
					})					
					
					existingCart[0].totalAmount += result3.price*requestBody.products[x].quantity;
				})
			}

			return existingCart[0].save()
			.then((updatedCart, error) => {
				if (error) {
					return `Failed to add product\\s to (${customer.fullName})\'s cart.`;
				}else{
					return `Product\\s were successfully added to (${customer.fullName})\'s cart.`;
				}
			});
		}
		
	}

};



// USER VIEW CART
module.exports.viewCart = async (customer) => {
	if (customer.isAdmin) {
		let message = Promise.resolve(`Admins do not have cart.`);

		return message.then((value) => {
			return value;
		});
	} else {
		return await Cart.find({userId : customer.userId})
		.then(result => {
			if(result.length === 0){
				return `You dont have a cart yet.`;
			}else{
				return `Number of Products in ${customer.fullName}'s cart: ${result[0].products.length}\n Total Amount: ${result[0].totalAmount} \n\nProducts: ${result}`;
			}
		});
	}
}