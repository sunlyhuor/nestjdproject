export class BlogDTO{

    title: string;
    content:string;
    status?:number;
    auth?:number;
    categories?:Array<number>
    thumbnail?:string;

}