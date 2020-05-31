import {Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn, OneToOne,OneToMany} from "typeorm";
import {Car} from "./Car";
import * as bcrypt from "bcryptjs";
import {Preference} from "./Preference";
import {type} from "os";
import {City} from "./CIty";
enum Gender {
    male = "Мужчина",
    female = "Женщина"
}

@Entity({name:"users"})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        length:100
    })
    password: string;

    @Column({
        length: 100,
        nullable: false
})
    name: string;

    @Column({length: 100,nullable: false})
    surname: string;

    @Column()
    gender: Gender;

    @Column("date",{nullable: false})
    date_of_Birth: Date;

    @Index({ unique: true })
    @Column({nullable: false,length:50})
    phone: string;

    @Column({
        nullable: false,
        length:50
    })
    @Index({ unique: true })
    email: string;

    @Column("text")
    inf_about_yourself: string;

    @Column({nullable: true})
    photo: string;

    // @OneToMany(type => Car, car => car.id, {
    //     nullable: false,
    //     cascade: true,
    //     eager: true
    // })
    // @JoinColumn()
    // car: Car;

    // @ManyToOne(type => Preference,preference=>preference.id,{
    //     nullable: false,
    //     cascade: true,
    //     eager: true
    // })
    // @JoinColumn()
    // preference: Preference;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}
