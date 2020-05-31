import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Preference} from "../entity/Preference";

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
        const preferenceRepository = getRepository(Preference);
        let {email, password, name, surname, gender, date_of_Birth, phone, inf_about_yourself, talk, smoke, animal,music} = req.body;
        let user = new User();
        let pref = new Preference();

        user.email = email;
        user.password = password;
        user.name = name;
        user.surname = surname;
        user.gender = gender;
        user.date_of_Birth = date_of_Birth;
        user.phone = phone;
        user.inf_about_yourself = inf_about_yourself;

        // Hash the password, to securely store on DB
        user.hashPassword();

        // Try to save. If fails, the username is already in use
        try {
           await userRepository.save(user);
            pref.talk = "Normal";
            pref.smoke = "Normal";
            pref.animal = "Normal";
            pref.music = "Normal";
            pref.user = user;
           await preferenceRepository.save(pref);
        } catch (e) {
            res.status(409).send("email, phone already in use");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send(user);
        res.status(201).send(pref);

    }

    static edit = async (req: Request, res: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        let userId =req.body.userId;
        //Get values from the body
        const {email, password, name, surname, phone, inf_about_yourself,date_of_Birth} = req.body;
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
        user.phone = phone;
        user.password = password;
        user.inf_about_yourself = inf_about_yourself;
        user.date_of_Birth = date_of_Birth;

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
