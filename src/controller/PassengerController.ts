import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Passenger} from "../entity/Passenger";
import {Trip} from "../entity/Trip";

export class PassengerController {

    static all = async (req: Request, res: Response, next: NextFunction) => {
        //Get users from database
        const passengerRepository = getRepository(Passenger);
        const passengers = await passengerRepository.find();
        //Send the users object
        res.send(passengers);
    };

    // static one = async (req: Request, res: Response, next: NextFunction) => {
    //     const userRepository = getRepository(User);
    //     try {
    //         const user = await userRepository.findOneOrFail(req.params.id);
    //         res.send(user);
    //     } catch (error) {
    //         res.status(404).send("User not found");
    //     }
    // }
    static myPassenger = async (req: Request, res: Response, next: NextFunction) => {
        //Get My trips from database
        const tripIdNumber = req.body.tripIdInf;
        // console.log(req.body.trip)
        const passengerRepository = getRepository(Passenger);
        try{
            const myPassenger = await passengerRepository.find({ where: { trip_id: tripIdNumber} });
            res.send(myPassenger);
            // console.log(myPassenger)
        }
        catch (error) {
            res.status(404).send("Not found");
        }
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
