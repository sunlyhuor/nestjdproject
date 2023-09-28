export class AuthDTO {
    code:string
    username:string
    firstname:string
    lastname:string
    email:string
    password:string
    role:number = 1
    method:number = 1
    phone:string = ""
    photoURL:string = "huor.jpg"
    role_type:string = ""

    public getEmail():string { return this.email}
    public setEmail(email:string) { this.email = email}

    public getPassword():string { return this.password}
    public setPassword(password:string) { this.password = password}

    public clear():void{
        this.code = "",
        this.email = "",
        this.username = "",
        this.firstname = "",
        this.lastname = "",
        this.password = "",
        this.role = 1,
        this.method = 1,
        this.phone = "",
        this.photoURL = "huor.jpg",
        this.role_type = ""
    }

}