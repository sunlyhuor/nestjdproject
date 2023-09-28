import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusEntity } from "./StatusEntity";
import { AuthEntity } from "./AuthEntity";
import { PlanCourseDetailEntity } from "./PlanCourseDetailEntity";
import { BuyPlanEntity } from "./BuyPlanEntity";



@Entity("plans_tb")
export class PlanEntity{

    @PrimaryGeneratedColumn()
    plan_id: number

    @Column({type:"varchar" , length:25 , nullable:false})
    plan_name: string

    @Column({type: "decimal" , precision: 5 , scale:2 })
    plan_price: number

    @Column({type: "smallint" , default: 1 })
    plan_month: number

    @ManyToOne( ()=> StatusEntity , status => status.status_id )
    @JoinColumn({name:"status_id"})
    status: StatusEntity

    @ManyToOne( ()=> AuthEntity , auth => auth.auth_id )
    @JoinColumn({name:"auth_id"})
    auth: AuthEntity

    @Column( { type:"decimal" , precision:3 , scale:1 } )
    plan_discount:number

    @Column({ type:"timestamp" })
    plan_discount_date:string

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    plan_createat: string;

    @OneToMany(()=> PlanCourseDetailEntity , plancoursedetail => plancoursedetail.plan )
    plan_course_detail:PlanCourseDetailEntity[]

    @OneToMany( ()=> BuyPlanEntity , buyplan => buyplan.plan )
    buy_plans:BuyPlanEntity[]

}