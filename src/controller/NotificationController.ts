import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { Notification } from "../entity/Notification";
import {Trip} from "../entity/Trip";
// import {checkJwt} from "../middlewares/checkJwt";
// import {  NotFoundError } from "routing-controllers";

export class NotificationController {

    static all = async (req: Request, res: Response, next: NextFunction) => {
        //Get users from database
        const getNotification = getRepository(Notification);
        const notice = await getNotification.find();
        //Send the users object
        res.send(notice);
    };

    static one = async (req: Request, res: Response, next: NextFunction) => {
        const getNotification = getRepository(Notification);
        try {
            const notification = await getNotification.findOneOrFail({ where: { id: res.locals.jwtPayload.userId}, order: {id: "DESC"}});
            res.send(notification);
        } catch (error) {
            res.status(404).send("Notification not found");
        }
    }
    static save = async (req: Request, res: Response, next: NextFunction) => {
        const getNotification = getRepository(Notification);
        let { notification_text, toUser,fromUser } = req.body;
        let notice = new Notification();
        notice.notification_text = notification_text,
        notice.toUser = toUser,
        notice.fromUser = fromUser
        try {
            await getNotification.save(notice);

        } catch (e) {
            res.status(409).send("err");
            return;
        }
        // If all ok, send 201 response
        res.status(201).send(notice);
    }
    static myNotifications = async (req: Request, res: Response, next: NextFunction) => {
        //Get My trips from database
        const userId = req.body.toUser;

        const getNotification = getRepository(Notification);
        const myNotification = await getNotification.find({ where: { toUser: userId} });
        //Send the myTrips object
        res.send(myNotification);
    };


    static remove = async (req: Request, res: Response, next: NextFunction) => {
        const getNotification = getRepository(Notification);
        let NoticeToRemove = await getNotification.findOne({ where: { id: req.params.id}});
        // if (!NoticeToRemove)
        //     throw new NotFoundError('Notification was not found.')
        try {
            await getNotification.remove(NoticeToRemove);

        } catch (error) {
            res.status(404).send("Notification was not found.");
            return;
        }

        // After all send a 201 response
        res.status(201).send("Notification deleted");
    }

}
