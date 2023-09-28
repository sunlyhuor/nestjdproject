import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne , JoinColumn } from "typeorm"
import { BlogEntity } from "./BlogEntity"
import { CourseEntity } from "./CourseEntity"
import { AuthEntity } from "./AuthEntity"

@Entity("dislikes_tb")
export class DisLikeEntity{

    @PrimaryGeneratedColumn()
    dislike_id:number

    @ManyToOne( ()=> BlogEntity , blog=>blog.blog_id )
    @JoinColumn({ name:"blog_id" })
    blog: BlogEntity

    @ManyToOne( ()=> CourseEntity , course=>course.course_id ) 
    @JoinColumn({name:"course_id" })
    course: CourseEntity	

    @ManyToOne( ()=> AuthEntity , auth=>auth.auth_id )
    @JoinColumn({name:"auth_id" })
    auth: AuthEntity

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    dislike_createat: string;

}
