import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {User} from "./User";
import {City} from "./CIty";
@Entity({name:"trips"})
export class Trip {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.id, {
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    driver: User;

    @ManyToOne(type => City,city=>city.id,{
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    point_of_shipment: City;

    // @Column("int", { array: true, nullable:true })
    // waypoints: number[];
    @Column("int", {array: true})
    waypoints: number;

    @ManyToOne(type => City,city=>city.id,{
        nullable: false,
        cascade: true
    })
    @JoinColumn()
    destination: City;

    @Column("date",{nullable: false})
    date: Date;

    @Column("time",{nullable: false})
    time: string;

    @Column({length:100,nullable: false})
    price: string;

    @Column({nullable: false})
    amount_seats: number;

    @Column({nullable: false})
    free_seats: number;
}
