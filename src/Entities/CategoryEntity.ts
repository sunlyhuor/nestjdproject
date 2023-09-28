import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne, JoinColumn } from "typeorm"
import { AuthEntity } from "./AuthEntity"
import { CourseBlogCategoryDetailEntity } from "./CourseBlogCategoryDetailEntity"

@Entity({name:"categories_tb"})
export class CategoryEntity{

    @PrimaryGeneratedColumn( {type:"smallint"} )
    category_id:number

    @Column( { type:"varchar" , length : 20 } )
    category_name:string

    @Column( { type:"timestamp" , default:()=> "CURRENT_TIMESTAMP"  } )
    category_created:string

    @Column({type:"smallint" , nullable:true , default : 1})
    type:number

    @OneToMany(()=> CourseBlogCategoryDetailEntity , course_blog_category => course_blog_category.category , { onDelete:"CASCADE" } )
    categoriesCourseBlog:CourseBlogCategoryDetailEntity[]

}
