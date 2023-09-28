export type MessageType = {
    code?:string,
    message:string,
    status:boolean,
    error?:any,
    token?:string,
    refresh_token?:string,
    responses?:Array<any>,
    course?:any,
    tokenIsexpired?:boolean
    role?:string,
    verify?:boolean
}