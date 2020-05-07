import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Car} from "./entity/Car";
import {Trip} from "./entity/Trip";
import {Passenger} from "./entity/Passenger";
import {City} from "./entity/CIty";
import {Intermediate_point} from "./entity/Intermediate_point";
import {Preference} from "./entity/Preference";
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
