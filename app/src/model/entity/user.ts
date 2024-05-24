import { Entity, PrimaryGeneratedColumn, Column, Generated, Index, DeleteDateColumn, OneToMany } from "typeorm";
import Product from "./product";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column({ unique: true })
    @Generated('uuid')
    uuid: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    public login: string;
    
    @Column({ type: 'varchar', length: 50, nullable: true })
    public password?: string;
    
    @Column({ type: 'varchar', length: 255})
    @Index()
    public name: string;
    
    @Column({
        default: () => "CURRENT_TIMESTAMP",
        type: "timestamp"
    })
    public createdAt: Date;

    // if bussines need to controll what user created product
    // @OneToMany(type => Product, product => product.user, { lazy: true })
    // public products: Product[];
 
    @DeleteDateColumn()
    public deletedAt: Date;
}
