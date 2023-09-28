import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne , JoinColumn } from "typeorm"
import { AuthEntity } from "./AuthEntity"

@Entity({name:"roles_tb"})
export class RoleEntity{

    @PrimaryGeneratedColumn( {type:"bigint"} )
    role_id:number

    @Column( { type:"varchar" , length : 15 } )
    role_name:string

    @OneToMany( ()=> AuthEntity , auth=> auth.role )
    auths:AuthEntity[]
}
