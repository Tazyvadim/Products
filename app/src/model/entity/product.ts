import { Entity, PrimaryGeneratedColumn, Column, Generated, Index, DeleteDateColumn, CreateDateColumn } from "typeorm";
import { ProductCategory } from "../../lib/types";

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

    @CreateDateColumn({ name: 'createdAt'})
    public createdAt: Date;
}
