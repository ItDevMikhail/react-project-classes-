import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import userRouter from "./routes/usersRouter.js";
import booksRouter from "./routes/booksRouter.js";
import cookieParser from "cookie-parser";



const PORT = process.env.PORT || 5000;

const app = express();

const mongoUrl = 'mongodb+srv://user:user@cluster0.1cstu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(express.static('backend/static'));

// app.use(function (req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
//     next();
// });

app.use('/api/library', booksRouter);
app.use('/api/users', userRouter);


async function start() {
    try {
        await mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true });
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`);
        });
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}
start();