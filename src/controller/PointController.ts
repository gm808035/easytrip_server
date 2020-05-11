import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Intermediate_point} from "../entity/Intermediate_point";
import {User} from "../entity/User";


export class PointController {

    static all = async (req: Request, res: Response, next: NextFunction) => {
        //Get users from database
        const pointRepository = getRepository(Intermediate_point);
        const points = await pointRepository.find();
        //Send the users object
        res.send(points);
    };

    static one = async (req: Request, res: Response, next: NextFunction) => {
        const pointRepository = getRepository(Intermediate_point);
        try {
            const points = await pointRepository.findOneOrFail(req.params.id);
            res.send(points);
        } catch (error) {
            res.status(404).send("Point not found");
        }
    }
    static save = async (req: Request, res: Response, next: NextFunction) => {
        const pointRepository = getRepository(Intermediate_point);
        let {trip_id, intermediate_point } = req.body;
        let points = new Intermediate_point();
        points.trip_id = trip_id;
        points.intermediate_point = intermediate_point;

        // Try to save. If fails, the username is already in use
        try {
            await pointRepository.save(points);
        } catch (e) {
            res.status(409).send("");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send(points);
    }

    static edit = async (req: Request, res: Response, next: NextFunction) => {
        const pointRepository = getRepository(Intermediate_point);
        let pointId = await pointRepository.findOne(req.params.id);

        //Get values from the body
        const { trip_id, intermediate_point } = req.body;
        let points;
        try {
            points = await pointRepository.findOneOrFail(pointId);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("Point not found");
            return;
        }
        points.trip_id = trip_id;
        points.intermediate_point = intermediate_point;

        //Try to safe, if fails, that means username already in use
        try {
            await pointRepository.save(points);
        } catch (e) {
            res.status(409).send("");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send("Edited successfully");
    };

    static remove = async (req: Request, res: Response, next: NextFunction) => {
        const pointRepository = getRepository(Intermediate_point);
        let pointToRemove = await pointRepository.findOne(req.params.id);

        try {
            await pointRepository.remove(pointToRemove);
        } catch (error) {
            res.status(404).send("Point not found");
            return;
        }

        // After all send a 201 response
        res.status(201).send("Point deleted");
    }

}
