const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	
	userId: {
		type: String,
		required: [true, "User ID is required."]
	},

	customerName: {
		type: String,
		required: [true, "Customer Name is required."]
	},

	products: [{

		productId: {
			type: String,
			required: [true, "Product ID is required."]
		},

		productName: {
			type: String,
			required: [true, "Product Name is required."]
		},

		productImageLink: {
			type: String,
			required: [true, "Product Image Link is required."]
		},

		productDescription: {
			type: String,
			required: [true, "Product Descripion is required."]
		},

		productPrice: {
			type: Number,
			required: [true, "Product Price is required."]
		},

		quantity: {
			type: Number,
			default: 1
		},

		addedOn: {
			type: Date,
			default: new Date()
		},

		subtotal: {
			type: Number,
			default: 0
		}

	}],

	totalAmount: {
		type: Number,
		default: 0
	}

});


module.exports = mongoose.model("Cart", cartSchema);