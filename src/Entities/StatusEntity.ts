import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne, JoinColumn } from "typeorm"
import { CourseEntity } from "./CourseEntity"
import { BlogEntity } from "./BlogEntity"
import { BuyCoursesEntity } from "./BuyCourseEntity"
import { PlanEntity } from "./PlanEntity"
import { AuthEntity } from "./AuthEntity"
import { BuyPlanEntity } from "./BuyPlanEntity"

@Entity({name:"status_tb"})
export class StatusEntity{

    @PrimaryGeneratedColumn( {type:"smallint"} )
    status_id:number

    @Column( { type:"varchar" , length : 20 } )
    status_name:string

    @OneToMany( ()=> CourseEntity , course=> course.status )
    courses:CourseEntity[]

    @OneToMany( ()=> BlogEntity , blog=> blog.status )
    blogs:BlogEntity[]

    @OneToMany( ()=> BuyCoursesEntity , buycourse => buycourse.status )
    buycurses:BuyCoursesEntity[]

    @OneToMany( ()=> PlanEntity , plan => plan.status )
    plans:PlanEntity[]

    @OneToMany( ()=> BuyPlanEntity , buyplan => buyplan.status )
    buyplans:BuyPlanEntity[]

}

