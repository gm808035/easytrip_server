import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import {User} from "./Users";

enum Status {
    good,
    normal,
    bad
}

@Entity()
export class Preference {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    talk: Status;

    @Column()
    smoke: Status;

    @Column()
    animal: Status;

    @Column()
    music: Status;

    @OneToOne(() => User, (user: User) => user.preference)
    user: User;
}