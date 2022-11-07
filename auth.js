const jwt = require("jsonwebtoken");
const secret = "ECommerceAPI";


module.exports.createAccessToken = (user) => {
	const data = {
		id : user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
	return jwt.sign(data, secret, {});
};

module.exports.verify = (request, response, next) => {
	let token = request.headers.authorization

	if(typeof token !== "undefined"){
		console.log(token)

		token = token.slice(7, token.lenght)

		return jwt.verify(token, secret, (error, data) => {
			if(error){
				return response.send({
					auth: "Failed"
				})
			}else{
				next()
			}
		})
	}else{
		return null
	}

}


module.exports.decode = (token) => {
	if(typeof token !== "undefined"){
		token = token.slice(7, token.length)

		return jwt.verify(token, secret, (error, data) => {
			if(error){
				return null 
			} else {
				return jwt.decode(token, {complete: true}).payload
			}
		})
	} else {
		return null
	}
}

