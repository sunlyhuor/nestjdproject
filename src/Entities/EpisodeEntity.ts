import { Entity , Column , PrimaryGeneratedColumn , OneToMany , ManyToOne, JoinColumn } from "typeorm"
import { CourseEntity } from "./CourseEntity"
import { AuthEntity } from "./AuthEntity"
import { StatusEntity } from "./StatusEntity"

@Entity("episodes_tb")
export class EpisodeEntity{
    @PrimaryGeneratedColumn()
    episode_id:number

    @Column({type:"smallint"})
    episode:number

    @Column( { type:"varchar" , length : 30 , nullable:false } )
    episode_title:string

    @ManyToOne( ()=> CourseEntity , course=>course.course_id , { onDelete:"CASCADE" } )
    @JoinColumn({name:"course_id"})
    course:CourseEntity

    @Column({type:"varchar" , length:200 })
    episode_description:string

    @ManyToOne( ()=> AuthEntity , auth => auth.auth_id )
    @JoinColumn({ name:"auth_id" })
    auth:AuthEntity

    @Column({type:"varchar", length:500 , nullable:false})
    episode_url:string

    @ManyToOne( ()=> StatusEntity , status=>status.status_id )
    @JoinColumn({name:"status_id"})
    status:StatusEntity

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" } )
    episode_createat: string;

}