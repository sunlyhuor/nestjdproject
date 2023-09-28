import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "src/Entities/RoleEntity";
import { StatusEntity } from "src/Entities/StatusEntity";
import { PaymentEntity } from "src/Entities/PaymentEntity";
import { MethodEntity } from "src/Entities/MethodEntity";
import { In, Repository } from "typeorm";

@Injectable()
export class MigrateService{
    constructor(
        @InjectRepository(RoleEntity) private roleReposity:Repository<RoleEntity>,
        @InjectRepository(StatusEntity) private statusReposity:Repository<StatusEntity>,
        @InjectRepository(PaymentEntity) private paymentReposity:Repository<PaymentEntity>,
        @InjectRepository(MethodEntity) private methodReposity:Repository<MethodEntity>,
    ){}

    private async migateRole(){
            try {
                await this.roleReposity.insert(
                    [
                        {
                            role_id:1,
                            role_name:"Admin"
                        },
                        {
                            role_id:2,
                            role_name:"User"
                        }
                    ]
                )
            } catch (error) {
               
            }
    }

    private async migratemethod(){

        try {
            await this.methodReposity.insert([
                {
                    method_id:1,
                    method_name:"WithEmailPassword"
                },
                {
                    method_id:2,
                    method_name:"WithGoogle"
                },
                {
                    method_id:3,
                    method_name:'WithFacebook'
                },
                {
                    method_id:4,
                    method_name:"WithGithub"
                }
            ])
            
        } catch (error) {
            
        }

    }

    private async migratePayment(){
        try {
            
            await this.paymentReposity.insert([
                {
                    payment_id:1,
                    payment_name:"ABA"
                },
                {
                    payment_id:2,
                    payment_name:"ACLEDA"
                }
            ])

        } catch (error) {
            
        }
    }

    private async migrateStatus(){
        try {
            
            await this.statusReposity.insert(
                [
                    {
                        status_id:1,
                        status_name:"Padding"
                    },
                    {
                        status_id:2,
                        status_name:"Completed"
                    },
                    {
                        status_id:3,
                        status_name:"Wrong TID"
                    }
                ]
            )

        } catch (error) {
            
        }
    }

    async  Migrate():Promise<any>{

      this.migateRole()
      this.migratePayment()
      this.migrateStatus()
      this.migratemethod()
      return {
        message:"Migrating"
      }

    }

}