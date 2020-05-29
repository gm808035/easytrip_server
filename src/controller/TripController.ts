import {getRepository} from "typeorm";
import {NextFunction,Response,Request} from "express";
import {getConnection} from "typeorm";
import{Trip} from "../entity/Trip";
import {Intermediate_point} from "../entity/Intermediate_point";
import {Passenger} from "../entity/Passenger";

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
    static order = async (req: Request, res: Response, next: NextFunction) => {
        const passengersRepository = getRepository(Passenger);
        const tripRepository = getRepository(Trip);
        let {trip_id, passenger} = req.body;
        let pass = new Passenger();
        pass.trip_id = trip_id,
        pass.passenger = passenger,

        await passengersRepository.save(pass);
        // Try to save.
        try {
            await passengersRepository.save(pass);
            await getConnection()
                .createQueryBuilder()
                .update(Trip)
                .set({
                    free_seats: () => "free_seats - 1"
                })
                .where("id = :id", { id: trip_id })
                .execute();

        } catch (error) {
            res.status(409).send("Check fields");
            return;
        }
        // If all ok, send 201 response
        res.status(201).send(pass);
    };

    static myTrips = async (req: Request, res: Response, next: NextFunction) => {
        //Get My trips from database
        const driverId = req.body.driver;

        const tripRepository = getRepository(Trip);
        const myTrips = await tripRepository.find({ where: { driver: driverId} });
        //Send the myTrips object
        res.send(myTrips);
    };

    static search = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        let{point_of_shipment, destination, date, time} = req.body;
        try {
           let trips = await tripRepository.find({
                where:  {point_of_shipment: point_of_shipment, destination: destination, date: date, time: time}
            });
           if(trips.length === 0){
                trips = await tripRepository.find({
                   where:  {point_of_shipment: point_of_shipment, destination: destination, date: date}
               });
                res.send(trips);
           }
            res.send(trips);

        }catch (error) {
            res.status(404).send("Not found");
        }
    }


    static save = async (req: Request, res: Response, next: NextFunction) => {
        const tripRepository = getRepository(Trip);
        const pointRepository = getRepository(Intermediate_point);

        let {driver, point_of_shipment, destination, date,time, price, amount_of_seats, free_seats, waypoints,inf_about_trip} = req.body;
        let trip = new Trip();
        trip.driver = driver;
        trip.point_of_shipment = point_of_shipment;
        trip.destination = destination;
        trip.date = date;
        trip.time = time;
        trip.price = price;
        trip.amount_seats = amount_of_seats;
        trip.free_seats = amount_of_seats;
        trip.waypoints = waypoints;
        trip.inf_about_trip = inf_about_trip;


        let points = []
        for (let i = 0; i < waypoints.length; i++) {
            const intermediate_point = { trip_id: {}, intermediate_point: 0 };
            intermediate_point.trip_id = trip;

            intermediate_point.intermediate_point = waypoints[i];

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
        const {driver, point_of_shipment, destination, date,time, price, amount_of_seats, free_seats,inf_about_trip} = req.body;
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
        trip.inf_about_trip = inf_about_trip;
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
        const passengersRepository = getRepository(Passenger);
        const pointRepository = getRepository(Intermediate_point);

        let tripToRemove = await tripRepository.findOne(req.params.id);
        let passengerToRemove = await passengersRepository.findOne(req.params.id);
        let pointToRemove = await pointRepository.findOne(req.params.id);
        try {
            await pointRepository.remove(pointToRemove);
            await passengersRepository.remove(passengerToRemove);
            await tripRepository.remove(tripToRemove);
        } catch (error) {
            res.status(404).send("Trip not found");
            return;
        }

        // After all send a 201 response
        res.status(201).send("Trip deleted");
    }


}
