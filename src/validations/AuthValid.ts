export class AuthValidition{

    public isEmail( email:string ):boolean{

        const reg = /[a-zA-Z0-9]@[a-zA-Z]{3,10}\.[a-zA-Z]{3,6}/
        if( reg.test( email ) ) return true
        else return false

    }

}