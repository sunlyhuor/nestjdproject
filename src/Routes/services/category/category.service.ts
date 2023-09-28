/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { CategoryEntity } from 'src/Entities/CategoryEntity';
import { MessageType } from 'src/components/MessageType';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    private message:MessageType

    constructor( 
        @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>
     ){}


    //Getter and Setter
        public setMeesage(value:MessageType){
            this.message = value
        } 
        public getMeesage():MessageType{
            return this.message
        }
    //End of Getter and Setter
    
    //Handle Function
        public async CatetoryCreate(category:Array<string> , type:number ):Promise<void>{
            try{
                
                if( type == null ){
                    type = 1;
                }

                category.forEach(async (e)=>{
                    await this.categoryRepository.insert({
                        category_name:e,
                        type:type
                    })
                })
                this.setMeesage({ message:"Categories inserted successfully!" , status:true })

            }
            catch(e){
                this.setMeesage({ message:"Categories inserted failed!" , status:true })
            }
        }

        public async CategoriesSelecte():Promise<void>{
            try {

                const data = await this.categoryRepository.find({
                    select:{
                        category_name:true,
                        category_id:true,
                        type:true
                    }
                })

                if( data.length > 0 ){
                    this.setMeesage( { message:"Categories selected" , status:true , responses:data } )
                }else{
                    this.setMeesage( { message:"No category" , status:false } )
                }

            } catch (error) {
                this.setMeesage( { message:"No category" , status:false } )
            }
        }

        public async CategoryDelete( categories:Array< number > ):Promise<void>{

            try{
                categories.forEach(async e=>{
                    await this.categoryRepository.delete({
                        category_id : e
                    })
                } )

                this.setMeesage({ message:"Deleted successully!!" , status:true })

            }
            catch(e){
                this.setMeesage({ message:"Deleted failed!!" , status:false })
            }

        }

        public async CategoryUpdate( id:number , newname:string ):Promise<void>{

            const data = await this.categoryRepository.find({
                where:{
                    category_id:id
                }
            })

            if( newname != ""){
                if( data.length < 1 ){
                    this.setMeesage( { message:"Item you're want update doesn't has!" , tokenIsexpired:false , status:false } )
                }else{
                    try{
                        await this.categoryRepository.update(
                            {
                                category_id:id
                            },
                            {
                                category_name : newname
                            }
                        )
                        this.setMeesage( { message:"Updated successfully!" , tokenIsexpired:false , status:true } )
                    }catch(e){
                        this.setMeesage( { message:"Updated failed!" , tokenIsexpired:false , status:false } )
                    }
                }
            }else{
                this.setMeesage( { message:"Make sure your new name field not emty!" , tokenIsexpired:false , status:false } )
            }

        }

    //End of handle function


}
