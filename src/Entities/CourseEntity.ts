import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne, JoinColumn, Like, CreateDateColumn } from "typeorm"
import { StatusEntity } from "./StatusEntity"
import { CategoryEntity } from "./CategoryEntity"
import { AuthEntity } from "./AuthEntity"
import { CourseBlogCategoryDetailEntity } from "./CourseBlogCategoryDetailEntity"
import { LikeEntity } from "./LikeEntity"
import { DisLikeEntity } from "./DisLikeEntity"
import { BuyCoursesEntity } from "./BuyCourseEntity"
import { PlanCourseDetailEntity } from "./PlanCourseDetailEntity"
import { BuyPlanEntity } from "./BuyPlanEntity"
import { EpisodeEntity } from "./EpisodeEntity"

@Entity( "courses_tb" )
export class CourseEntity{

    @PrimaryGeneratedColumn()
    course_id:number

    @Column( { type:"varchar" , length : 200 , nullable: false } )
    course_code:string

    @Column( { type:"varchar" , length : 50 , nullable: false } )
    course_title:string

    @Column( { type:"decimal", precision:5 , scale:2 , nullable:false } )
    course_price:number

    @Column( { type:"decimal" , precision:5 , scale:1 , nullable:true , default: 0.0 } )
    course_discount:number

    @CreateDateColumn({type:"timestamp"})
    // @Column( { type:"timestamp" , default:()=> "CURRENT_TIMESTAMP" } )
    course_discount_date:Date

    // Status Entity foreign Key
    @ManyToOne( ()=> StatusEntity , status=>status.status_id  )
    @JoinColumn({ name:"status_id"  })
    status:StatusEntity

    @Column( { type:"varchar" , length:250 , nullable:true , default: 'No desctiption......' } )
    course_description:string

    @Column( { type:"varchar" , length:200 , nullable:true } )
    course_thumbnail:string

    @ManyToOne( ()=> AuthEntity , auth=>auth.auth_id )
    @JoinColumn({ name:"auth_id" })
    auth:AuthEntity

    @Column({ type: "smallint" , nullable:false , default:1 })
    course_month:number

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    course_createat: string;

    @OneToMany( ()=> CourseBlogCategoryDetailEntity , course_blog_category => course_blog_category.course )
    categories:CourseBlogCategoryDetailEntity[]

    @OneToMany( ()=>EpisodeEntity , episode => episode.course )
    episodes:EpisodeEntity[]

    @OneToMany( ()=> LikeEntity , like=>like.course )
    likes:LikeEntity[]

    @OneToMany( ()=> DisLikeEntity , dislike => dislike.course )
    dislikes:DisLikeEntity[]

    @OneToMany( ()=> BuyCoursesEntity , buycourse => buycourse.course )
    buycourses:BuyCoursesEntity[]

    @OneToMany( ()=> PlanCourseDetailEntity , plancoursedetail => plancoursedetail.course )
    plan_course_detail:PlanCourseDetailEntity[]

    @OneToMany( ()=> BuyPlanEntity , buyplan => buyplan.course )
    buy_plans:BuyPlanEntity[]

}
