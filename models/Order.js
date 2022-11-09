const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const User = require("./User.js")


const orderSchema = new mongoose.Schema({

	userId: {
	    type: mongoose.Schema.Types.ObjectId, ref: 'User',
	},
	products : [{
		productId : {
			type: String,
			required : [true, "ProductId is required."]
		},
		quantity : {
			type: Number,
			required : [true, `required`]
		}
	}],
	totalAmount : {
		type : Number,
		default: 0
	},
	purchasedOn: {
		type: Date,
		default: new Date()
	}

});




module.exports = mongoose.model("Order", orderSchema)