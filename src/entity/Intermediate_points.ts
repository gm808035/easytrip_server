import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import{Trip} from "./Trips";
import {City} from "./CIties";

@Entity({name:"intermediate_points"})
export class Intermediate_point {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Trip, trip => trip.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    trip_id: Trip;

    @ManyToOne(type => City,city=>city.id,{
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    intermediate_point: City;
}