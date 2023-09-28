/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Delete, Get, Post, Req , Res , Put } from '@nestjs/common';
import { CategoryService } from 'src/Routes/services/category/category.service';

@Controller("api/v1/category")
export class CategoryController {

    constructor( private categoryService:CategoryService ){}

    @Post("create")
    async insertCategory(@Req() req:any ){
        const { categories , type } = req.body
        let ct:Array<string> = new Array()
        categories.forEach(category => ct.push(category) )
        this.categoryService.CatetoryCreate( ct , type )
        return this.categoryService.getMeesage()
    }

    @Put("update")
    async updateCategory( @Req() req , @Res() res ){
        
        // const code = req.code;
        const { id , newname } = req.body

        await this.categoryService.CategoryUpdate( id , newname )
        if( await this.categoryService.getMeesage().status ){
            res.status(201).send( await this.categoryService.getMeesage() ) 
        }else{
            res.status(301).send( await this.categoryService.getMeesage() ) 
        }

    }

    @Delete("delete")
    async deleteCategory(@Req() req:any , @Res() res ){
        const { categories } = req.body
        let gts:Array<number> = new Array()
        categories.forEach(category => gts.push(category) )
        await this.categoryService.CategoryDelete(gts)
        res.status(201).send( await this.categoryService.getMeesage() )
    }

    @Get()
    async SelectCategories(){
        await this.categoryService.CategoriesSelecte()
        return  await this.categoryService.getMeesage()
    }

}
