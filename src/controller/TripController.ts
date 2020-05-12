import {getRepository} from "typeorm";
import {NextFunction,Response,Request} from "express";
import{Trip} from "../entity/Trip";
import {Intermediate_point} from "../entity/Intermediate_point";

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

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        try {
            const trip = await tripRepository.findOneOrFail(req.params.point_of_shipment);
            res.send(trip);
        } catch (error) {
            res.status(404).send("Trip not found");
        }
    }


    static save = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        const pointRepository = getRepository(Intermediate_point);

        let {driver, point_of_shipment, destination, date,time, price, amount_of_seats, free_seats, waypoints} = req.body;
        let trip = new Trip();
        // let intermediate_point = new Intermediate_point();
        trip.driver = driver;
        trip.point_of_shipment = point_of_shipment;
        trip.destination = destination;
        trip.date = date;
        trip.time = time;
        trip.price = price;
        trip.amount_seats = amount_of_seats;
        trip.free_seats = free_seats;
        trip.waypoints = waypoints;

        let points = []
        for (let i = 0; i < waypoints.length; i++) {
            const intermediate_point = { trip: {}, points: 0 };
            intermediate_point.trip = trip;

            intermediate_point.points = waypoints[i];

            points.push(intermediate_point);
        }
        await pointRepository.save(points);
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
