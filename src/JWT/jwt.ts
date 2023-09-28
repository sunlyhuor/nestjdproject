import { sign , verify } from "jsonwebtoken"

export function generateToken(code):string{
    // const token = sign(code , process.env.SECRETE_JWT )
    const token = sign(code , process.env.SECRETE_JWT , { expiresIn:"10m" } )
    return token
}

export function generateRefreshToken(code):string{
    // const token = sign( code , process.env.SECRETE_REFRESH_JWT) 
    const token = sign( code , process.env.SECRETE_REFRESH_JWT , { expiresIn:"24h" })
    return token
}

export async function generateNewAccessToken(code:string):Promise<any>{
    try{

        const token = generateToken( { code : code} )
        return {
            message:"Generated successfully!",
            access_token: token,
            status: true
        }

    }catch(e){
        return{
            message:"Expired refresh token",
            status: false,
            refreshtokenIsexpired:true, 
            error:e
        }
    }
}

export async function verifyToken(jwt:string):Promise<any>{

    try{

        const data = await verify(jwt , process.env.SECRETE_JWT)
        return {
            data: data,
            status:true
        }

    }catch(e){
        return {
            message:"Token Expired",
            tokenIsexpired:true,
            status:false
        }
    }

}

export async function CheckToken (req , res , next){
    const { access_token } = req.headers
    const token = await verifyToken(access_token)
    if( token.status ){
      req.code = token.data.code
      next()
    }
    else{
      res.status(403).send( token )
    }
}

export async function CheckTokenNoMiddleware ( access_token:string ):Promise<any>{
    const token = await verifyToken(access_token)
    if( token.status ){
      return token
    }
    else{
        return token
    //   res.status(403).send( token )
    }
}

export async function CheckRefreshToken (req , res , next){
    const { refresh_token } = req.headers
    try {
            const token = await verify(refresh_token , process.env.SECRETE_REFRESH_JWT)
            req.code = token.code
            next()
    } catch (error) {
        res.status(403).json({
            message:"Refresh token's expired!",
            refreshtokenIsexpired:true,
            tokenIsexpired:false
        })
    }
}

export function VerifiedAccountSignToken( id ){
    const token = sign(id , process.env.SECRETE_JWT , { expiresIn:"1m" } )
    return token
}

export async function VerifiedAccountVerifyToken( token:string ){

    try{
        const data = await verify( token , process.env.SECRETE_JWT)
        return {
            data: data,
            status:true
        }

    }catch(e){
        return {
            message:"Token Expired",
            tokenIsexpired:true,
            status:false
        }
    }

}
