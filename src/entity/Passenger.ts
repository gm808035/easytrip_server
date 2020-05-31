import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import{Trip} from "./Trip";
import {User} from "./User";

@Entity({name:"passengers"})
export class Passenger {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Trip, trip => trip.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    trip_id: Trip;

    @ManyToOne(type => User, user => user.id, {
        nullable: false,
        cascade: true,
        eager: true
    })
    // @Column({nullable: false})
    @JoinColumn()
    passenger: User;
}
