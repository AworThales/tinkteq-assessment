const mongoose = require("mongoose");


const DatabaseConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log("connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = DatabaseConnect;