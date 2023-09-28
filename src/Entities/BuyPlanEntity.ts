import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlanEntity } from "./PlanEntity";
import { CourseEntity } from "./CourseEntity";
import { StatusEntity } from "./StatusEntity";
import { PaymentEntity } from "./PaymentEntity";
import { AuthEntity } from "./AuthEntity";


@Entity("buy_plans_tb")
export class BuyPlanEntity{

    @PrimaryGeneratedColumn()
    buy_plan_id:number

    @ManyToOne( ()=> PlanEntity , plan => plan.plan_id )
    @JoinColumn({name:"plan_id"})
    plan:PlanEntity

    @Column({type:"decimal" , precision:5 , scale:2})
    buy_plan_price:string

    @ManyToOne( ()=> CourseEntity , course => course.course_id )
    @JoinColumn({name:"course_id"})
    course:CourseEntity

    @Column({type:"timestamp"})
    expired_date:string
    
    @ManyToOne( ()=> StatusEntity , status => status.status_id )
    @JoinColumn({name:"status_id"})
    status:StatusEntity

    @ManyToOne( ()=> PaymentEntity , payment=>payment.payment_id )
    @JoinColumn({name:"payment_id"})
    payment:PaymentEntity

    @ManyToOne( ()=> AuthEntity , auth => auth.auth_id )
    @JoinColumn({name:"auth_id"})
    auth:AuthEntity

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    buy_plan_createat: string;


}