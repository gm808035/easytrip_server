import {getRepository} from "typeorm";
import {NextFunction, Request, response, Response} from "express";
import {City} from "../entity/CIty";
export class CityController {
    static all = async (req: Request, res: Response, next: NextFunction) => {
        //Get cities from database
        const cityRepository = getRepository(City);
        const cities = await cityRepository.find();
        //Send the cities object
        res.send(cities);
    };

    static one = async (req: Request, res: Response, next: NextFunction) => {
        const cityRepository = getRepository(City);
        try {
            const city = await cityRepository.findOneOrFail(req.params.id);
            res.send(city);
        } catch (error) {
            res.status(404).send("City not found");
        }
    }

    static waypoints = async (req: Request, res: Response, next: NextFunction) => {
        const cityRepository = getRepository(City);
        const cityIds = req.body.waypoints;
        let cityPromise = []
        let attributes = []
        try {
            for (let i = 0; i < cityIds.length; i++) {
                cityPromise.push(cityRepository.findOneOrFail(cityIds[i]));
            }
            Promise.all(cityPromise)
                .then(responses => responses.map(
                    response => {
                        attributes.push(response.attribute)
                    }
                )).then(response => { res.send(attributes) })
        } catch (error) {
            res.status(404).send("City not found");
        }
    }
    static save = async (req: Request, res: Response, next: NextFunction) => {
        const cityRepository = getRepository(City);
        let {city_name,attribute} = req.body;
        let city = new City();

        city.city_name = city_name;
        city.attribute = attribute;
        // Try to save.
        try {
            await cityRepository.save(city);
        } catch (error) {
            res.status(409).send("Check fields");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send(city);
    }

    static edit = async (req:Request, res:Response, next:NextFunction)=> {
        const cityRepository = getRepository(City);
        let cityId = await cityRepository.findOne(req.params.id);
        //get values from body
        const {city_name} = req.body;
        let city;
        try{
            city = await cityRepository.findOneOrFail(cityId);
        }catch (error) {
            //if not found,send 404 response
            res.status(404).send("City not found");
            return ;
        }
        city.city_name=city_name;
        //try to save
        try {
            await cityRepository.save(city);
        }catch (error) {
            res.status(409).send("Check fields");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send("Edited successfully");
    };

    static remove = async (req: Request, res: Response, next: NextFunction) => {
        const cityRepository = getRepository(City);
        let cityToRemove = await cityRepository.findOne(req.params.id);

        try {
            await cityRepository.remove(cityToRemove);
        } catch (error) {
            res.status(404).send("City not found");
            return;
        }

        // After all send a 201 response
        res.status(201).send("City deleted");
    }

}
