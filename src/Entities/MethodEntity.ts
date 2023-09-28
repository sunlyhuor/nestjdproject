import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne } from "typeorm"
import { AuthEntity } from "./AuthEntity"
import { CourseEntity } from "./CourseEntity"

@Entity({name:"methods_tb"})
export class MethodEntity{

    @PrimaryGeneratedColumn( {type:"bigint"} )
    method_id:number

    @Column( { type:"varchar" , length : 20 } )
    method_name:string

    @OneToMany( ()=> AuthEntity , auth=> auth.method )
    auths:AuthEntity[]

}
