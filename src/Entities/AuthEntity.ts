import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne , JoinColumn } from "typeorm"
import { MethodEntity } from "../Entities/MethodEntity"
import { RoleEntity } from "./RoleEntity"
import { MediaEntity } from "./MediaEntity"
import { CourseEntity } from "./CourseEntity"
import { BlogEntity } from "./BlogEntity"
import { LikeEntity } from "./LikeEntity"
import { DisLikeEntity } from "./DisLikeEntity"
import { BuyCoursesEntity } from "./BuyCourseEntity"
import { PlanEntity } from "./PlanEntity"
import { BuyPlanEntity } from "./BuyPlanEntity"
import { ResumeEntity } from "./ResumeEntity"

@Entity({name:"auths_tb"})
export class AuthEntity{

    @PrimaryGeneratedColumn( {type:"bigint"} )
    auth_id:number

    @Column( { type:"varchar" , length : 100 , unique:true , nullable:false } )
    auth_code:string
    
    @Column( { type:"varchar" , length : 30 , unique:true , nullable:false } )
    auth_username:string
    
    @Column( { type:"varchar" , length : 20 , nullable:false } )
    auth_firstname:string
    
    @Column( { type:"varchar" , length : 20 , nullable : false } )
    auth_lastname:string

    @Column( { type:"varchar", length : 50, nullable : false , unique:true } )
    auth_email:string

    @Column( { nullable:false , type: "varchar" , length: 150 } )
    auth_password:string

    @Column( { nullable: true, type: "varchar", length: 100 } )
    auth_phone:string
    
    @Column( {  type : "timestamp" , nullable : true ,  } )
    auth_birth:string

    @Column( {  type : "varchar" , length:100 , nullable : true   } )
    auth_photo:string

    @Column( {  type : "varchar" , length:10 , nullable : true   } )
    auth_verify:string

    @Column({type:"varchar" , length:5 , nullable:false , default:"0" })
    auth_verified:string
    // Forign Key from Method Entity With method_id type : method one can has auth one or more than 
    @ManyToOne( ()=> MethodEntity , method => method.method_id  , { cascade:["insert" , "update"] })
    @JoinColumn( { name : "method_id" } )
    method:MethodEntity

    // Forign Key from Role Entity With role_id type : role one can has auth one or more than 
    @ManyToOne( ()=> RoleEntity , role=> role.role_id , { cascade:["insert" , "update"] } )
    @JoinColumn( { name:"role_id" } )
    role:RoleEntity

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    auth_createat: string;

    @OneToMany( ()=> MediaEntity , media=> media.auth )
    medias: MediaEntity[]

    @OneToMany( ()=> CourseEntity , course=>course.auth )
    courses: CourseEntity[]

    @OneToMany( ()=> BlogEntity , blog=> blog.auth )
    blogs: BlogEntity[]

    @OneToMany( ()=> LikeEntity , like=>like.auth )
    likes: LikeEntity[]

    @OneToMany( ()=> DisLikeEntity , dislike => dislike.auth  )
    dislikes:DisLikeEntity[]

    @OneToMany( ()=> BuyCoursesEntity , buycourse => buycourse.auth )
    buycourses: BuyCoursesEntity[]

    @OneToMany( ()=> PlanEntity , plan => plan.auth )
    plans: PlanEntity[]

    @OneToMany( ()=> BuyPlanEntity , buyplan=> buyplan.auth)
    buy_plans: BuyPlanEntity[]

    @OneToMany( ()=> ResumeEntity, resume => resume.auths )
    resumes:ResumeEntity[]
}
