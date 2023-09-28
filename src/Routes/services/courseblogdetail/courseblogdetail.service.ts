/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/Entities/CategoryEntity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { MessageType } from 'src/components/MessageType';
import { CourseBlogCategoryDetailEntity } from 'src/Entities/CourseBlogCategoryDetailEntity';

@Injectable()
export class CourseblogdetailService {
    private categoryService:CategoryService
    private message:MessageType

    constructor( 
        @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>,
        @InjectRepository(CourseBlogCategoryDetailEntity) private courseblogdetailRepository:Repository<CourseBlogCategoryDetailEntity>,
    ){
        this.categoryService = new CategoryService(this.categoryRepository)
    }

    //Getter and Setter
        public getMessage():MessageType {
            return this.message
        }
        public setMessage(message:MessageType){ this.message = message }
    //End of Getter and Setter
    //Handle
        public async CoursDetailCreate( categories:number , courses:number ): Promise<void>{
            try {
                await this.courseblogdetailRepository.insert({
                    category:{
                        category_id:categories
                    },
                    course:{
                        course_id:courses
                    }
                })
                this.setMessage({message:"Create course blog category successfully!" , status:true})
            } catch (error) {
                this.setMessage({message:"Create course blog category failed!" , status:false})
            }
        }

        public async CourseDetailUpdateCategory( course:number ,category:number , category_update:number ):Promise<void>{

            try {
                const data = await this.courseblogdetailRepository.find({
                    where:{
                        course:{
                            course_id:course
                        },
                        category:{
                            category_id:category_update
                        }
                    },
                    relations:{
                        category:true
                    }
                })

                if( data.length > 0){
                }
                else{
                    await this.courseblogdetailRepository.update(
                        {
                            course:{
                                course_id:course
                            },
                            category:{
                                category_id:category
                            },
                        },
                        {
                            category:{
                                category_id:category_update
                            }
                        },
                    )
                }
                this.setMessage({ message:"Category updated Successfully!" ,status:true })
            } catch (error) {
                this.setMessage({ message:"Category updated failed!" ,status:false , error:error })
            }

        }

        public async CourseDetailDeleteCategory( course:number , category:number ):Promise<void>{
            
            await this.courseblogdetailRepository.delete({
                course:{
                    course_id:course
                },
                category:{
                    category_id:category
                }
            })

        }
        //Up is Course
        public async BlogDetailCreate( categories:number , blog:number ):Promise<void>{
            try{
                await this.courseblogdetailRepository.insert({
                    category:{
                        category_id:categories
                    },
                    blog:{
                        blog_id:blog
                    }
                })
                this.setMessage({ message:"Category created successfully", status:true , tokenIsexpired:false})
            }catch(e){
                this.setMessage({ message:"Category created failed", status:false, tokenIsexpired:false})
            }
        }

        public async BlogAddCategory( id:number , blog:number , category:number ):Promise<void>{

            try {

                const data = await this.courseblogdetailRepository.find({
                    where:{
                        blog:{
                            blog_id:blog,
                            auth:{
                                auth_id:id
                            }
                        },
                        category:{
                            category_id:category
                        }
                    }
                })

                if( data.length < 1 ){
                    await this.courseblogdetailRepository.insert({
                        blog:{
                            blog_id:blog,
                            auth:{
                                auth_id:id
                            }
                        },
                        category:{
                            category_id:category
                        }
                        
                    })
                }

                this.setMessage({ message:"Category added successfully", status:true , tokenIsexpired:false })
                
            } catch (error) {
                this.setMessage({ message:"Category added failed", status:false , tokenIsexpired:false })
            }

        }

        public async BlogDeleteCategories( id:number , blog:number , category:number ){
            try {
                await this.courseblogdetailRepository.delete({
                    blog:{
                        blog_id:blog,
                        auth:{
                            auth_id:id
                        }
                    },
                    category:{
                        category_id:category
                    }
                })
                this.setMessage({ message:"Successfully" , status:true , tokenIsexpired:false })
            } catch (error) {
                this.setMessage({ message:"Failed" , status:false , tokenIsexpired:false })
            }
        }

        public async BlogUpdateCategories( id:number , blog:number , category:number , update:number):Promise<void>{

            try {
                
                await this.courseblogdetailRepository.update(
                    {
                        blog:{
                            blog_id:blog,
                            auth:{
                                auth_id:id
                            }
                        },
                        category:{
                            category_id:category
                        }
                    },
                    {
                        category:{
                            category_id:update
                        }
                    }
                )
                this.setMessage({ message:"Successfully" , status:true , tokenIsexpired:false })

            } catch (error) {
                this.setMessage({ message:"Failed" , status:false , tokenIsexpired:false })
            }

        }

    //End of Handle

}
