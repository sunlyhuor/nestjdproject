import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PlanEntity } from "./PlanEntity";
import { CourseEntity } from "./CourseEntity";


@Entity("plans_course_details_tb")
export class PlanCourseDetailEntity{

    @PrimaryGeneratedColumn()
    plan_course_detail:number

    @ManyToOne( ()=> PlanEntity , plan => plan.plan_id )
    @JoinColumn({name:"plan_id"})
    plan:PlanEntity

    @ManyToOne( ()=> CourseEntity , course => course.course_id )
    @JoinColumn({name:"course_id"})
    course:CourseEntity

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    plan_course_detail_createat: string;

}