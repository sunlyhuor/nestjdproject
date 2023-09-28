import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne , JoinColumn } from "typeorm"
import { BlogEntity } from "./BlogEntity"
import { CourseEntity } from "./CourseEntity"
import { CategoryEntity } from "./CategoryEntity"

@Entity("course_blog_category_details_tb")
export class CourseBlogCategoryDetailEntity{

        @PrimaryGeneratedColumn()
        course_blog_category_id:number

        @ManyToOne( ()=> BlogEntity , blog=> blog.blog_id , { onDelete:"CASCADE" })
        @JoinColumn({name:"blog_id"})
        blog:BlogEntity

        @ManyToOne( ()=> CourseEntity , course=> course.course_id , { onDelete:"CASCADE" } )
        @JoinColumn({name:"course_id"})
        course:CourseEntity

        @ManyToOne( ()=> CategoryEntity , category=> category.category_id , { onDelete:"CASCADE" } )
        @JoinColumn({name:"category_id"})
        category:CategoryEntity

}       

