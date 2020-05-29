import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {User} from "./User";

@Entity({name:"cars"})
export class Car {

    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(type => User, user => user.id, {
        nullable: false,
        cascade: true,
        eager: true
    })
    @JoinColumn()
    user: User;
    @Column({length:50})
    car_model: string;

    @Column({length:50})
    country: string;

    @Column({length:50})
    car_number: string;

}
