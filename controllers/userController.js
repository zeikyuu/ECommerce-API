const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Product = require("../models/Product.js")


module.exports.registerUser = (reqBody) => {
	let newUser = new User({
		firstName : firstName,
		lastName: lastName,
		email : reqBody.email,
		password : bcrypt.hashSync(reqBody.password, 10)
		// 10 = salt
	})

	return newUser.save().then((user, error) => {
		if(error){
			return false;
		}else{
			return true;
		}
	})
}


module.exports.loginUser = (reqBody) => {
	return User.findOne({email : reqBody.email}).then(result => {
		if(result == null){
			return false;
		}else{
			const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

			if(isPasswordCorrect){
				//Generate an access
				return  {access : auth.createAccessToken(result)}
			}
		}
	})
}