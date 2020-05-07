import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import {User} from "./User";

enum Status {

    good = "Good",
    normal = "Normal",
    bad = "Bad"

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
