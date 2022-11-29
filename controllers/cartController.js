const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

module.exports.addToCartMany = async (customer, requestBody) => {
	
	if (customer.isAdmin) {
		let message = Promise.resolve(`Admin cannot create cart.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
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

				if (requestBody.products[x].productId.length !== 24) {
					return {
						status: false,
						message: `Product ID of Item No. ${x} is invalid.`
					}
				}else {

					await Product.findById(requestBody.products[x].productId)
					.then(result2 => {

						let index = newCart.products.findIndex( item => item.productId === requestBody.products[x].productId);

						if (index >= 0) {
							newCart.products[index].quantity += requestBody.products[x].quantity;
							newCart.products[index].subtotal += result2.price*requestBody.products[x].quantity;
							newCart.totalAmount += result2.price*requestBody.products[x].quantity;
						}else{
							newCart.products.push({
								productId: requestBody.products[x].productId,
								productName: result2.name,
								productPrice: result2.price,
								quantity: requestBody.products[x].quantity,
								subtotal: result2.price*requestBody.products[x].quantity
							})
							newCart.totalAmount += result2.price*requestBody.products[x].quantity;

							Product.findByIdAndUpdate(requestBody.products[x].productId, {
								stocks: result2.stocks - requestBody.products[x].quantity
							})
							.then((updatedProductStocks, error) => {
								if (error) {
									return {
										status: false,
										message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
									}
								}else{
									return {
										status: true,
										message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
									}
								}
							})
						}						
					})
				}
			};

			return newCart.save()
			.then((newCart, error) => {
				if(error){
					return {
						status: false,
						message: `Error in creating cart.`
					}
				}else{
					return {
						status: true,
						message: `New cart for (${newCart.customerName}) was successfully created!`
					}
				}
			});
		}

		else{
			for(let x = 0; x < requestBody.products.length; x++){

				if (requestBody.products[x].productId.length !== 24) {
					return {
						status: false,
						message: `Product ID of Item No. ${x} is invalid.`
					}

				}else{
					await Product.findById(requestBody.products[x].productId)
					.then(result3 => {

						let index = existingCart[0].products.findIndex( item => item.productId === requestBody.products[x].productId);

						if (index >= 0) {
							existingCart[0].products[index].quantity += requestBody.products[x].quantity;
							existingCart[0].products[index].subtotal += result3.price*requestBody.products[x].quantity;
							existingCart[0].totalAmount += result3.price*requestBody.products[x].quantity;
						}else{
							existingCart[0].products.push({
								productId: requestBody.products[x].productId,
								productName: result3.name,
								productPrice: result3.price,
								quantity: requestBody.products[x].quantity,
								// COMPUTE FOR SUBTOTAL: PER PRODUCT
								subtotal: result3.price*requestBody.products[x].quantity
							})					
							existingCart[0].totalAmount += result3.price*requestBody.products[x].quantity;
							Product.findByIdAndUpdate(requestBody.products[x].productId, {
								stocks: result3.stocks - requestBody.products[x].quantity
							})
							.then((updatedProductStocks, error) => {
								if (error) {
									return {
										status: false,
										message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
									}
								}else{
									return {
										status: true,
										message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
									}
								}
							})
						}
						
					})
				}
				
			}

			return existingCart[0].save()
			.then((updatedCart, error) => {
				if (error) {
					return {
						status: false,
						message: `Failed to add products to (${customer.fullName})\'s cart.`
					}
				}else{
					return {
						status: true,
						message: `Products were successfully added to (${customer.fullName})\'s cart.`
					}
				}
			});
		}
		
	}

};


module.exports.addToCart = async (customer, requestBody) => {
	
	
		let existingCart = await Cart.find({userId : customer.userId})
		.then(cart => {
			return cart;
		});
		
		if (existingCart.length === 0) {
			let newCart = new Cart({
				userId: customer.userId,
				customerName: customer.fullName
			})

			
			await Product.findById(requestBody.productId)
			.then(result2 => {

				let index = newCart.products.findIndex( item => item.productId === requestBody.productId);

				if (index >= 0) {
					newCart.products[index].quantity += 1;
					newCart.products[index].subtotal += result2.price;
					newCart.totalAmount += result2.price;
				}else{
					newCart.products.push({
						productId: requestBody.productId,
						productName: result2.name,
						productPrice: result2.price,
						productImageLink: result2.imageLink,
						productDescription: result2.description,
						quantity: 1,
						subtotal: result2.price
					})
					newCart.totalAmount += result2.price;

					Product.findByIdAndUpdate(requestBody.productId, {
						stocks: result2.stocks-1
					})
					.then((updatedProductStocks, error) => {
						if (error) {
							return {
								status: false,
								message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
							}
						}else{
							return {
								status: true,
								message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
							}
						}
					})
				}						
			})


			return newCart.save()
			.then((newCart, error) => {
				if(error){
					return {
						status: false,
						message: `Error in creating cart.`
					}
				}else{
					return {
						status: true,
						message: `New cart for (${newCart.customerName}) was successfully created!`
					}
				}
			});
		}

		else{
			
			await Product.findById(requestBody.productId)
			.then(result3 => {

				let index = existingCart[0].products.findIndex( item => item.productId === requestBody.productId);

				if (index >= 0) {
					existingCart[0].products[index].quantity += 1;
					existingCart[0].products[index].subtotal += result3.price;
					existingCart[0].totalAmount += result3.price;

					Product.findByIdAndUpdate(requestBody.productId, {
						stocks: result3.stocks-1
					})
					.then((updatedProductStocks, error) => {
						if (error) {
							return {
								status: false,
								message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
							}
						}else{
							return {
								status: true,
								message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
							}
						}
					})
					
				}else{
					existingCart[0].products.push({
						productId: requestBody.productId,
						productName: result3.name,
						productImageLink: result3.imageLink,
						productDescription: result3.description,
						productPrice: result3.price,
						quantity: 1,
						subtotal: result3.price
					})					
					existingCart[0].totalAmount += result3.price;
					Product.findByIdAndUpdate(requestBody.productId, {
						stocks: result3.stocks-1
					})
					.then((updatedProductStocks, error) => {
						if (error) {
							return {
								status: false,
								message:`Failed to deduct from (${updatedProductStocks.name}) stocks.`
							}
						}else{
							return {
								status: true,
								message: `Product (${updatedProductStocks.name})'s stocks successfully deducted.`
							}
						}
					})
				}
				
			})

			return existingCart[0].save()
			.then((updatedCart, error) => {
				if (error) {
					return {
						status: false,
						message: `Failed to add products to (${customer.fullName})\'s cart.`
					}
				}else{
					return {
						status: true,
						message: `Products were successfully added to (${customer.fullName})\'s cart.`
					}
				}
			});
		}
		
	

};

module.exports.viewCart = async (customer) => {
	if (customer.isAdmin) {
		let message = Promise.resolve(`Admins do not have cart.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	} else {
		return await Cart.find({userId : customer.userId})
		.then(result => {
			if(result.length === 0){
				return {
					status: false,
					message: `Cart is empty.`
				}
			}else{
				return {
					status: true,
					itemCount: result[0].products.length,
					details: result
				}
			}
		});
	}
};



module.exports.updateCart = async (requestBody) => {

	let cart = await Cart.find({userId : requestBody.userId});
	let index = cart[0].products.findIndex( item => item.productId === requestBody.productId);

	cart[0].totalAmount -= cart[0].products[index].quantity*cart[0].products[index].productPrice;
	cart[0].products[index].quantity = requestBody.quantity;
	cart[0].products[index].subtotal = requestBody.quantity*cart[0].products[index].productPrice;
	cart[0].totalAmount += requestBody.quantity*cart[0].products[index].productPrice;

	
	return cart[0].save()
	.then((updatedCart, error) => {
		if (error) {
			return {
				status: false,
				message: `Failed to update cart.`
			}
		}else{
			return {
				status: true,
				message: `Cart successfully updated.`
			}
		}
	});
	
};




module.exports.removeFromCart = async (requestBody) => {

	let cart = await Cart.find({userId : requestBody.userId});
	let index = cart[0].products.findIndex( item => item.productId === requestBody.productId);
	cart[0].totalAmount -= cart[0].products[index].subtotal;
	cart[0].products.splice(index, 1);


	return cart[0].save()
	.then((updatedCart, error) => {
		if (error) {
			return {
				status: false,
				message: `Failed to update cart.`
			}
		}else{
			return {
				status: true,
				message: `Cart successfully updated.`
			}
		}
	});
	
};



module.exports.clearCart = async (userId) => {

	let cart = await Cart.find({userId: userId})

	return Cart.findByIdAndDelete(cart[0]._id)
	.then((deletedCart, error) => {
		if (error) {
			return {
				status: false,
				message: `Failed to clear cart.`
			};
		}else{
			return {
				status: true,
				message: `Cart successfully cleared.`
			};
		}
	})
};