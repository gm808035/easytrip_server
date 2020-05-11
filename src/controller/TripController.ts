import {getRepository} from "typeorm";
import {NextFunction,Response,Request} from "express";
import{Trip} from "../entity/Trip";

export class TripController {

    static all = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        const trips = await tripRepository.find();
        res.send(trips)
    };

    static one = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        try {
            const trip = await tripRepository.findOneOrFail(req.params.id);
            res.send(trip);
        } catch (error) {
            res.status(404).send("Trip not found");
        }
    }

    static save = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        // const pointRepository = getRepository(IntermediatePoint);

        let {driver, point_of_shipment, destination, date,time, price, amount_of_seats, free_seats} = req.body;
        let trip = new Trip();
        // let intermediate_point = new IntermediatePoint();

        trip.driver = driver;
        trip.point_of_shipment = point_of_shipment;
        trip.destination = destination;
        trip.date = date;
        trip.time = time;
        trip.price = price;
        trip.amount_seats = amount_of_seats;
        trip.free_seats = free_seats;

        // Try to save.
        try {
            await tripRepository.save(trip);
            // await pointRepository.save(intermediate_point);
        } catch (error) {
            res.status(409).send("Check fields");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send(trip);
    }

    static edit = async (req:Request, res:Response, next:NextFunction)=> {
        const tripRepository = getRepository(Trip);
        let tripId = await tripRepository.findOne(req.params.id);
        //get values from body
        const {driver, point_of_shipment, destination, date,time, price, amount_of_seats, free_seats} = req.body;
        let trip;
        try{
            trip = await tripRepository.findOneOrFail(tripId);
        }catch (error) {
            //if not found,send 404 response
            res.status(404).send("City not found");
            return ;
        }
        trip.driver = driver;
        trip.point_of_shipment = point_of_shipment;
        trip.destination = destination;
        trip.date = date;
        trip.time = time;
        trip.price = price;
        trip.amount_seats = amount_of_seats;
        trip.free_seats = free_seats;
        //try to save
        try {
            await tripRepository.save(trip);
        }catch (error) {
            res.status(409).send("Check fields");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send("Edited successfully");
    };

    static remove = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        let tripToRemove = await tripRepository.findOne(req.params.id);

        try {
            await tripRepository.remove(tripToRemove);
        } catch (error) {
            res.status(404).send("Trip not found");
            return;
        }

        // After all send a 201 response
        res.status(201).send("Trip deleted");
    }


}
