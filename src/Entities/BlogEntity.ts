import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne, JoinColumn } from "typeorm"
import { StatusEntity } from "./StatusEntity"
import { AuthEntity } from "./AuthEntity"
import { CourseBlogCategoryDetailEntity } from "./CourseBlogCategoryDetailEntity"
import { LikeEntity } from "./LikeEntity"
import { DisLikeEntity } from "./DisLikeEntity"

@Entity("blogs_tb")
export class BlogEntity{

    @PrimaryGeneratedColumn()
    blog_id:number

    @Column({ type: "varchar" , length:200 , nullable:false })
    blog_code:string

    @Column({ type: "varchar" , length:200 , nullable:false })
    blog_title:string

    @Column({ type:"varchar" , length: 5000 , nullable:false})
    blog_content:string

    @Column({type:"varchar" , length:250, nullable:false})
    blog_thumbnail:string

    @ManyToOne( ()=> StatusEntity , status=>status.status_id  )
    @JoinColumn({name:"status_id"})
    status:StatusEntity

    @ManyToOne( ()=> AuthEntity, auth => auth.auth_id)
    @JoinColumn({name:"auth_id"})
    auth:AuthEntity

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    blog_createat: Date;

    @OneToMany( ()=> CourseBlogCategoryDetailEntity , course_blog_category=> course_blog_category.blog  )
    categories:CourseBlogCategoryDetailEntity[]

    @OneToMany( ()=> LikeEntity , like=>like.blog )
    likes:LikeEntity[]

    @OneToMany( ()=> DisLikeEntity , dislike => dislike.blog )
    dislikes:DisLikeEntity[]

}

