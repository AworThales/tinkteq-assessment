const app = require("./app");
const DatabaseConnect = require("./config/database");
const cors = require("cors");

const cloudinary = require('cloudinary')

// Handle Uncaught exceptions
process.on('uncaughtException', err =>{
    console.log(`ERROR: ${err.message}`);
    console.log('UNCAUGHT EXCEPTION! �� Shutting down this server...');
    server.close(() => {
        process.exit(1);
    });
})


// CORS setup
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);


// console.log("a")

//setting UP cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

//connection
const server = app.listen(process.env.PORT || 7070, () =>{
    DatabaseConnect();
    console.log(`Server is starting on PORT: ${process.env.PORT || 7070} n ${process.env.NODE_ENV} mode.`)
})


//Handle Unhadled Promise rejection
process.on('unhandledRejection', err =>{
    console.log(`ERROR: ${err.stack}`);
    console.log('UNHANDLED REJECTION! �� Shutting down server...');
    server.close(() => {
        process.exit(1);
    });
})