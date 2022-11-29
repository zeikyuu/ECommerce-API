const bcrypt = require("bcrypt");
const auth = require("../auth.js");

const Product = require("../models/Product.js");

module.exports.addProduct = async (requestBody, isAdmin) => {
	if (isAdmin) {
		let existingProductName = await Product.find({ name : requestBody.name }); 
		if (existingProductName.length === 0) {
			let newProduct = new Product({
				name: requestBody.name,
				category: requestBody.category,
				imageLink: requestBody.imageLink,
				description: requestBody.description,
				stocks: requestBody.stocks,
				price: requestBody.price
			})

			
			if (newProduct.stocks === 0) {
				newProduct.isActive = false;
			}

			return newProduct.save()
			.then((newProduct, error) => {
				if (error) {
					return {
						status: false,
						message: `Failed to create product (${newProduct.name}).`
					}
				}else{
					return {
						status: true,
						message: `Product (${newProduct.name}) successfully created.`,
						details: newProduct
					}
				}
			});
		}else{
		
			let message = Promise.resolve(`Identical product name found. Please change name to avoid confusion.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				}
			});
		}
		
	}else{
	
		let message = Promise.resolve(`User must be admin to create a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}

};



module.exports.getActiveProducts = () => {

	return Product.find({ isActive : true})
	.then(result => {
		if(result.length == 0){
			return {
				status: false,
				message: `No active products found.`
			}
		}else{
			return {
				status: true,
				message: `Active product/s found: ${result.length}`,
				productList: result
			}
		}
	});

};


module.exports.getAllProducts = () => {

	return Product.find({})
	.then(result => {
		return result;
	})

};



module.exports.getProductDetails = (productId) => {


	if (productId.length === 24) {

		
		return Product.findById(productId)
		.then(result => {
			if(result == null){
				return {
					status: false,
					message: `Product not found.`
				}
			}else{
				return {
					status: true,
					message: `Product found.`,
					details: result
				}
			}
		});
	}else{
		
		let message = Promise.resolve(`The productID in url is invalid.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			};
		});
	}

};


module.exports.updateProduct = (productId, isAdmin, newData) => {


	if (isAdmin) {

	
		if (productId.length === 24) {

			// IF PARAMS ID IS VALID
			return Product.findByIdAndUpdate(productId, {
				name: newData.name,
				description: newData.description,
				category: newData.category,
				imageLink: newData.imageLink,
				stocks: newData.stocks,
				price: newData.price,
				isActive: newData.isActive
			})
			.then((updatedProduct, error) => {
				if (error) {
					return {
						status: false,
						message:`Failed to update product (${updatedProduct.name}).`
					}
				}else{
					return {
						status: true,
						message: `Product (${updatedProduct.name}) successfully updated.`
					}
				}
			})


		}else{
		
			let message = Promise.resolve(`The productID in url is invalid.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				};
			});
		}

	}else{
	
		let message = Promise.resolve(`User must be admin to update a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			};
		});
	}

};



module.exports.archiveProduct = (productId, isAdmin) => {

	
	if (isAdmin) {

		
		if (productId.length === 24) {

			
			return Product.findById(productId)
			.then(result => {
				// IF NO MATCH:
				if (result === null) {
					return {
						status: false,
						message: `Product not found`
					}
				}
				
				else{
				
					if (result.isActive === false) {
						return {
							status: false,
							message: `Sorry, (${result.name}) is already archived.`
						}
					}
					
					else{

						return Product.findByIdAndUpdate(productId, {isActive: false})
						.then((archivedProduct, error) => {
							if (error) {
								return {
									status: false,
									message: `Failed to archive product (${archivedProduct.name}).`
								}
							}else{
								return {
									status: true,
									message: `Product (${archivedProduct.name}) successfully archived.`
								}
							}
						})
						return {
							status: true
						}
					}
				}
			})

		}else{
		
			let message = Promise.resolve(`The productID in url is invalid.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				};
			});
		}
		
	}else{

		let message = Promise.resolve(`User must be admin to archive a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}

};


module.exports.unarchiveProduct = (productId, isAdmin) => {

	
	if (isAdmin) {

		
		if (productId.length === 24) {


			return Product.findById(productId)
			.then(result => {
			
				if (result === null) {
					return {
						status: false,
						message: `Product not found`
					}
				}
				
				else{
					
					if (result.isActive === true) {
						return {
							status: false,
							message: `Sorry, (${result.name}) is already active.`
						}
					}
					
					else{

						return Product.findByIdAndUpdate(productId, {isActive: true})
						.then((unarchivedProduct, error) => {
							if (error) {
								return {
									status: false,
									message: `Failed to activate product (${unarchivedProduct.name}).`
								}
							}else{
								return {
									status: true,
									message: `Product (${unarchivedProduct.name}) successfully unarchived.`
								}
							}
						})
						return {
							status: true
						}
					}
				}
			})

		}else{
		
			let message = Promise.resolve(`The productID in url is invalid.`);

			return message.then((value) => {
				return {
					status: false,
					message: value
				};
			});
		}
		
	}else{
	
		let message = Promise.resolve(`User must be admin to unarchive a product.`);

		return message.then((value) => {
			return {
				status: false,
				message: value
			}
		});
	}

};