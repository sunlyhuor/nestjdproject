import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne, JoinColumn } from "typeorm"
import { AuthEntity } from "./AuthEntity"

@Entity({name:"medias_tb"})
export class MediaEntity{

    @PrimaryGeneratedColumn( {type:"bigint"} )
    media_id:number

    @Column( { type:"varchar" , length : 150 } )
    media_name:string

    @ManyToOne( ()=> AuthEntity , auth => auth.auth_id  , { onDelete:"CASCADE" } )
    @JoinColumn({ name: "auth_id" })
    auth:AuthEntity
}
