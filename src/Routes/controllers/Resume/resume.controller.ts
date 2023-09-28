import { Body, Controller, Get, Post, Req, Res, UploadedFile } from "@nestjs/common";
import { ResumeDTO } from "src/DTO/ResumeDTO";
import { ResumeService } from "src/Routes/services/Resume/resume.service";

@Controller("api/v1/resume")
export class ResumeController{
    constructor( private resumeSerive:ResumeService ){}

    @Post("create")
    async createInformationResume( @Req() req, @Res() res, @Body() bd:ResumeDTO,  @UploadedFile() file ){
        const { headline , givedname , familyname, phone, address, pob, dob, educations, skills, languages, hobbies, references, email } = req.body
        const code = req.code
        // await this.resumeSerive.createResume( headline , givedname , familyname, phone, address, pob, dob, educations, skills, languages, hobbies, references, email, file.filename , code )
        const edu_str = JSON.stringify(educations)
        res.send(JSON.parse(edu_str).name)
    }

}