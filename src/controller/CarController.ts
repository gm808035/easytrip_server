import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Car} from "../entity/Car";
import {Trip} from "../entity/Trip";

export class CarController {
    static all = async (req: Request,res:Response, next:NextFunction) =>{
      // get cars from DB
      const carRepository = getRepository(Car);
      const cars = await  carRepository.find();
      //send the cars object
        res.send(cars)
    };

    static one = async (req:Request, res:Response, next:NextFunction)=>{
        // const carRepository = getRepository(Car);
        // try{
        //     const car = await carRepository.findOneOrFail(req.params.id);
        //     res.send(car);
        // }catch (error) {
        //     res.status(404).send("Car not found");
        // }
        //Get My trips from database
        const userId = req.body.carUser;

        const carRepository = getRepository(Car);
        const myCar = await carRepository.find({ where: { user: userId} });
        //Send the myTrips object
        res.send(myCar);
    }
    static myCars = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        const driverId = req.body.carUser;
            try{
                const myCars = await tripRepository.find({ where: { user: driverId} });
                res.send(myCars);
            }
            catch (error) {
                res.status(404).send("Not found");
            }
    };
    static save = async (req:Request, res:Response, next:NextFunction)=>{
        const carRepository = getRepository(Car);
        let{ user,car_model, country, car_number} = req.body
        let car= new Car();
        console.log(req.body)
        car.user = user;
        car.car_model = car_model;
        car.country = country;
        car.car_number = car_number;
        console.log(car)
        //try to save
        try {
            await carRepository.save(car);
        }catch (error) {
            res.status(409).send("Check fields");
            return;

        }
        //if all ok, send 201 res
        res.status(201).send(car);
    }

    static edit = async (req:Request, res:Response, next:NextFunction)=> {
        const carRepository = getRepository(Car);
        let userId = req.body.user;

        //get values from body
        const {car_model,country,car_number} = req.body;

        let car;
        try{
            car = await carRepository.findOneOrFail(userId);
        }catch (error) {
            //if not found,send 404 response
            res.status(404).send("Car not found");
            return ;
            console.log("test2")
        }
        car.car_model = car_model;
        car.country = country;
        car.car_number = car_number;
        console.log(car)
        //try to save
        try {
            await carRepository.save(car);
        }catch (error) {
            res.status(409).send("Check fields");
            return;
            console.log("test")
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send("Edited successfully");
    };

    static remove =async (req:Request, res:Response, next:NextFunction)=> {
        const carRepository = getRepository(Car);
        let carToRemove = await carRepository.findOne(req.params.id);
        try{
            await carRepository.remove(carToRemove);
        }catch (error) {
            res.status(404).send("Car not found");
            return;
        }
        // After all send a 201 response
        res.status(201).send("Car deleted");
    }

}
