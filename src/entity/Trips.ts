import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {User} from "./Users";
@Entity({name:"trips"})
export class Trip {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.id, {
        nullable: false,
        cascade: true
    })
    // @Column({nullable: false})
    @JoinColumn()
    driver: User;

    @Column({length:100,nullable: false})
    from: string;

    @Column({length:100,nullable: false})
    destination: string;

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
