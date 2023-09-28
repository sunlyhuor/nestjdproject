import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthEntity } from "./AuthEntity";

@Entity( { name : "resumes_tb" } )
export class ResumeEntity{

    @PrimaryGeneratedColumn({type:"bigint"})
    resume_id: number
    
    @Column({name:"resume_photo", length:200, nullable:false})
    resume_photo:string

    @Column( { name:"resume_givedname" , length:25, nullable:false } )
    resume_givedname:string

    @Column( { name:"resume_familyname" , length:25, nullable:false } )
    resume_familyname:string

    @Column( { name:"resume_email" , length:100, nullable:false } )
    resume_email:string

    @Column( { name:"resume_headline" , length:500, nullable:true } )
    resume_headline:string

    @Column( { name:"resume_phone" , length:30, nullable:false } )
    resume_phone:string

    @Column( { name:"resume_address" , length:500, nullable:false } )
    resume_address:string

    @Column( { name:"resume_dob", type:"date", nullable:false } )
    resume_dob :Date

    @Column( { name:"resume_pob" , length:150 , nullable:false } )
    resume_pob: string

    @Column( { name:"resume_educations" , length: 250 , nullable:true } )
    resume_educations: string

    @Column( { name:"resume_experiences" , length: 250 , nullable:false } )
    resume_experiences: string

    @Column( { name:"resume_skills" , length: 250 , nullable:true } )
    resume_skills: string

    @Column( { name:"resume_languages" , length: 100 , nullable:true } )
    resume_languages: string

    @Column( { name:"resume_hobbies" , length: 100 , nullable:true } )
    resume_hobbies: string

    @Column( { name:"resume_references" , length: 100 , nullable:true } )
    resume_references: string

    @ManyToOne( ()=> AuthEntity , auth => auth.auth_id, { cascade: [ "remove", "update" ] } )
    @JoinColumn({ name :"auth_id" })
    auths:AuthEntity
}