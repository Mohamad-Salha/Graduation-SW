const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Mohamad:100200300xyz@swgraduationproject.ieuyry3.mongodb.net/?appName=SWGraduationProject")
.then(() => {
	console.log("Connected to MongoDB successfully");
}).catch((err) => {
	console.error("Error connecting to MongoDB:", err);
});

module.exports = mongoose;