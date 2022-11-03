const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js")
const productRoutes = require("./routes/product.js")


const app = express();

mongoose.connect("mongodb+srv://admin:admin123@zuitt.qsixkvp.mongodb.net/Capstone2?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/users", userRoutes);
app.use("/products", productRoutes);



app.listen(process.env.PORT || 4000, () => {
	console.log(`API is now online on port ${process.env.PORT || 4000}`);
})