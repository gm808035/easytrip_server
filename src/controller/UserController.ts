import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/Users";

export class UserController {

    static all = async (req: Request, res: Response, next: NextFunction) => {
        //Get users from database
        const userRepository = getRepository(User);
        const users = await userRepository.find();
        //Send the users object
        res.send(users);
    };

    static one = async (req: Request, res: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(req.params.id);
            res.send(user);
        } catch (error) {
            res.status(404).send("User not found");
        }
    }
    static save = async (req: Request, res: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        let {email, password, name, surname, gender, date_of_Birth, phone, inf_about_yourself, car, preference} = req.body;
        let user = new User();

        user.email = email;
        user.password = password;
        user.name = name;
        user.surname = surname;
        user.gender = gender;
        user.date_of_Birth = date_of_Birth;
        user.phone = phone;
        user.inf_about_yourself = inf_about_yourself;
        user.car = car;
        user.preference = preference;

        // Hash the password, to securely store on DB
        user.hashPassword();

        // Try to save. If fails, the username is already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("email, phone already in use");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send(user);
    }

    static edit = async (req: Request, res: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        let userId = await userRepository.findOne(req.params.id);

        //Get values from the body
        const {email, password, name, surname, gender, phone} = req.body;
        let user;
        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("User not found");
            return;
        }

        user.email = email;
        user.name = name;
        user.surname = surname;
        user.gender = gender;
        user.phone = phone;
        user.password = password;

        user.hashPassword();

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("email or phone already in use");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send("Edited successfully");
    };

    static remove = async (req: Request, res: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        let userToRemove = await userRepository.findOne(req.params.id);

        try {
            await userRepository.remove(userToRemove);
        } catch (error) {
            res.status(404).send("User not found");
            return;
        }

        // After all send a 201 response
        res.status(201).send("User deleted");
    }

}
