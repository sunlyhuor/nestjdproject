export type ResumeDTO = {
    resume_photo:string
    resume_givedname:string
    resume_familyname:string
    resume_email:string
    resume_headline?:string
    resume_phone:string
    resume_address:string
    resume_dob:Date
    resume_pob:string
    resume_educations:Array<{ education:string, school:string, city:string, start:string, end:string, description:string }>
    resume_experiences:Array< { position:string, employer:string , city:string, start:Date, end:string, description:string } >,
    resume_skills:Array<{ skill:string , lavel:string }>
    resume_languages:Array< { language:string , level:string } >
    resume_hobbies?:Array<string>
    resume_references?:Array<{name:string, organization:string, city:string, phone:string, email:string }>
}