import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne} from "typeorm";
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
    talk: string;

    @Column()
    smoke: string;

    @Column()
    animal: string;

    @Column()
    music: string;

    @ManyToOne(type => User, user => user.id, {
        nullable: false,
        cascade: true,
        eager: true
    })
    @JoinColumn()
    user: User;
}
