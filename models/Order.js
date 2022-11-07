const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "User ID is required"]
	},
	products: [{
		productId: {
			type: String,
			required: [true, "Product ID is required"]
		},
		productName: {
			type: String,
			required: [true, "Product Name is required."]
		},
		quantity: {
			type: Number,
			required: [true, "Quantity is required"]
		}
	}],
	totalAmount: {
		type: Number,
		required: [true, "Total Amount is required"]
	},
	purchaseOn: {
		type: Date,
		default: new Date()
	}
})

module.exports = mongoose.model("Order", orderSchema);