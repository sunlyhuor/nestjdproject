import * as bcrypt from "bcrypt";

export async function createCrypt( password:string ): Promise<string>{
    return bcrypt.hashSync( password , bcrypt.genSaltSync(15) )
}

export function verifyPassword(password:string , hash:string):boolean{
    const hashs =  bcrypt.compareSync( password , hash)
    if(hashs){
        return true
    }else {
        return false
    }
}
