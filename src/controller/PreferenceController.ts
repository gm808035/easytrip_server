import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Preference} from "../entity/Preference";

export class PreferenceController {

    static all = async (req: Request, res: Response, next: NextFunction) => {
        // Get preferences from database
        const preferenceRepository = getRepository(Preference);
        const preferences = await preferenceRepository.find();
        // Send the preferences object
        res.send(preferences);
    };

    static one = async (req: Request, res: Response, next: NextFunction) => {
        const preferenceRepository = getRepository(Preference);
        try {
            const preference = await preferenceRepository.findOneOrFail(req.params.id);
            res.send(preference);
        } catch (error) {
            res.status(404).send("Preference not found");
        }
    }
    static save = async (req: Request, res: Response, next: NextFunction) => {
        const preferenceRepository = getRepository(Preference);
        let {talk, smoke, animal, music} = req.body;
        let preference = new Preference();
        preference.talk = talk;
        preference.smoke = smoke;
        preference.animal = animal;
        preference.music = music;

        // Try to save.
        try {
            await preferenceRepository.save(preference);
        } catch (error) {
            res.status(409).send("Check fields");
            return;
        }

        // If all ok, send 201 response
        res.status(201).send(preference);
    }

    static edit = async (req: Request, res: Response, next: NextFunction) => {
        const preferenceRepository = getRepository(Preference);
        let preferenceId = await preferenceRepository.findOne(req.params.id);

        //Get values from the body
        const {talk, smoke, animal, music} = req.body;
        let preference;
        try {
            preference = await preferenceRepository.findOneOrFail(preferenceId);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("Preference not found");
            return;
        }

        preference.talk = talk;
        preference.smoke = smoke;
        preference.animal = animal;
        preference.music = music;


        //Try to save.
        try {
            await preferenceRepository.save(preference);
        } catch (e) {
            res.status(409).send("Check fields");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(201).send("Edited successfully");
    };

    static remove = async (req: Request, res: Response, next: NextFunction) => {
        const preferenceRepository = getRepository(Preference);
        let preferenceToRemove = await preferenceRepository.findOne(req.params.id);

        try {
            await preferenceRepository.remove(preferenceToRemove);
        } catch (error) {
            res.status(404).send("Preference not found");
            return;
        }

        // After all send a 201 response
        res.status(201).send("Preference deleted");
    }

}
