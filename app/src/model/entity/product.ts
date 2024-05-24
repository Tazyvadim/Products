import { Entity, PrimaryGeneratedColumn, Column, Generated, Index, DeleteDateColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { ProductCategory } from "../../lib/types";
import User from "./user";

@Entity()
export default class Product {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    @Index()
    public title: string;

    @Column({ type: "text", nullable: true })
    public description: string;

    @Column({ type: "integer", nullable: false })
    public price: number;

    // this opt should be another table with relation ManyToOne
    // but for test project enum can be used
    @Column({ type: "enum", enum: ProductCategory, nullable: false })
    public category: ProductCategory;

    // if bussines need to controll what user created product
    // @ManyToOne(type => User, user => user.products, { lazy: true })
    // public user: User;

    @CreateDateColumn({ name: 'createdAt'})
    public createdAt: Date;
}
