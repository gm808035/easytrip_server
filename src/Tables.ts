import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/Users";
import {Car} from "./entity/Cars";
import {Trip} from "./entity/Trips";
import {Passenger} from "./entity/Passengers";
import {City} from "./entity/CIties";
import {Intermediate_point} from "./entity/Intermediate_points";
import {Preference} from "./entity/Preferences";
var sql = require('mssql');

createConnection({
    "type": "mssql",
    "host": "DESKTOP-IKSB8VU\\SQLEXPRESS1",
    "username": "KA",
    "password": "123",
    "database": "ETrip",
    entities: [
        User,
        Car,
        Trip,
        Passenger,
        City,
        Intermediate_point,
        Preference
    ],
    synchronize: true,
    logging: false
}).then(connection => {
    // here you can start to work with your entities
}).catch(error => console.log(error));