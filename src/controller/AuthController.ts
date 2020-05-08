import  { Request, Response } from "express";
import  * as jwt from "jsonwebtoken";
import  { getRepository } from "typeorm";
import { validate } from "class-validator";

import {User} from "../entity/User";
import config from "../config/config";

class AuthController {

    static login = async (req: Request, res: Response) => {
        // Check if email and password are set
        let { email, password } = req.body;
        if (!(email && password)) {
            res.sendStatus(400);
        }

        // Get user from db
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: {email} })
        }
        catch (error) {
            res.sendStatus(401);
        }

        // Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.sendStatus(401);
            return;
        }

        // Sign JWT, valid 1 hour
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );
        // Send the jwt in the response
        res.send({token: token, user: user});
    };
    static logout = async (req: Request, res: Response) => {
        res.status(200).send("User logout successfully");
    }

    static changePassword = async (req: Request, res: Response) => {
        // Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        // Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword && newPassword) {
            res.sendStatus(400);
        }

        // Get user from the db

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.sendStatus(401);
        }

        // Check if old password matches
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.sendStatus(401);
            return;
        }

        // Validate the model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.sendStatus(400);
            return
        }

        // Hash the new password and save
        user.hashPassword();
        await userRepository.save(user);

        res.sendStatus(204);
    }

}
export default AuthController;
