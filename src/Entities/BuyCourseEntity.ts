import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne , JoinColumn, UpdateDateColumn} from "typeorm"
import { CourseEntity } from "./CourseEntity"
import { StatusEntity } from "./StatusEntity"
import { PaymentEntity } from "./PaymentEntity"
import { AuthEntity } from "./AuthEntity"

@Entity("buy_courses_tb")
export class BuyCoursesEntity{
    
    @PrimaryGeneratedColumn()
    buy_course_id:number

    @ManyToOne( ()=> CourseEntity , course=> course.course_id )
    @JoinColumn({name:"course_id"})
    course:CourseEntity

    @Column( { type:"decimal", precision:5 , scale:2 , nullable:false } )
    buy_price:number

    @Column( { type:"smallint" , nullable:false } )
    buy_month:number

    @Column( { type:"timestamp" , default: () => "CURRENT_TIMESTAMP" } )
    expired_date:Date

    @ManyToOne( ()=> StatusEntity , status => status.status_id )
    @JoinColumn({name:'status_id'})
    status:StatusEntity

    @ManyToOne( ()=> PaymentEntity , payment => payment.payment_id )
    @JoinColumn({name:"payment_id"})
    payment:PaymentEntity

    @ManyToOne( ()=> AuthEntity , auth => auth.auth_id )
    @JoinColumn({name:"auth_id"})
    auth:AuthEntity

    @Column({type:"varchar" , length:20 , nullable:false })
    payment_tid:string

    @UpdateDateColumn({ name:"buy_course_updateat" })
    buy_course_updateat: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    buy_course_createat: Date;

}