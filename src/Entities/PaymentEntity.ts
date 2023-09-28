import { Column , PrimaryGeneratedColumn , ManyToOne, Entity, OneToMany } from "typeorm"
import { BuyCoursesEntity } from "./BuyCourseEntity";
import { BuyPlanEntity } from "./BuyPlanEntity";

@Entity("payments_tb")
export class PaymentEntity{

    @PrimaryGeneratedColumn()
    payment_id:number

    @Column({type:"varchar" , length:15 , nullable:false})
    payment_name:string

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    payment_createat: string;

    @OneToMany( ()=> BuyCoursesEntity , buycourse => buycourse.payment )
    buy_courses: BuyCoursesEntity[];

    @OneToMany( ()=> BuyPlanEntity , buyplan => buyplan.payment )
    buy_plans: BuyPlanEntity[]

}