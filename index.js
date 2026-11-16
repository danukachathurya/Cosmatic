import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());

// Middleware to log the Authorization token from the request headers
app.use(
    (req, res, next) => {
        let token = req.header("Authorization")

        if (token != null) {
            token = token.replace("Bearer ", "")
            console.log(token)
            jwt.verify(token, "jwt-secret", (err, decoded) => {
                if (decoded == null) {
                    res.json({
                        message: 'Invalid token',
                    })
                    return
                } else {
                    req.user = decoded
                }
            })
        }
        next()
    }
)

const connectionString = 'mongodb+srv://danukachathurya431:danukachathurya431@cluster0.gwiqr3z.mongodb.net/';

mongoose.connect(connectionString).then(
    () => {
        console.log('Database connected');
    }
).catch(
    () => {
        console.log('Database connection failed');
    }
)

app.use('/users', userRouter);
app.use('/products', productRouter);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});