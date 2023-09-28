export class CourseDTO{
    course_title:string;
    course_price:number;
    course_discount?:number;
    course_discount_date?:Date;
    course_description:string;
    course_thumbnail:string;
    course_month:number;
    status:number = 1 ;
    auth:number;
    code?:string
}