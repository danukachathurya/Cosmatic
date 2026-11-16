import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {

    const hashedPassword = bcrypt.hashSync(req.body.password, 10); // 10 is the salt rounds

    const user = new User(
        {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword
        }
    );
    user.save().then(
        () => {
            res.json({
                message: 'User created successfully',
            })
        }
    ).catch(
        () => {
            res.json({
                message: 'User creation failed',
            })
        }
    )
}

//controller function to handle user login
export function loginUser(req, res) {

    User.findOne(
        {
            email: req.body.email
        }).then(
            (user) => {
                if (user == null) {
                    res.json(
                        {
                            message: 'User not found',
                        }
                    )
                } else {
                    const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password); // Compare the provided password with the hashed password in the database
                    if (isPasswordMatching) {

                        const token = jwt.sign(
                            {
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                                isEmailVerified: user.isEmailVerified,
                            },
                            "jwt-secret"
                        )

                        res.json({
                            message: 'Login successful',
                            token: token
                        })
                    } else {
                        res.json({
                            message: 'Incorrect password',
                        })
                    }
                }
            }
        )
}

//controller function to handle user logout
export function isAdmin(req){
    if(req.user == null) {
        return false;
    }
    if(req.user.role != 'admin') {
        return false;
    }
    return true;
}

// //controller function to handle user logout
// export function isCustomer(req){
//     if(req.user == null) {
//         return false;
//     }
//     if(req.user.role != 'user') {
//         return false;
//     }
//     return true;
// }