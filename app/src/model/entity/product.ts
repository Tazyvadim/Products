import { Entity, PrimaryGeneratedColumn, Column, Generated, Index, DeleteDateColumn } from "typeorm";
import { ProductCategory } from "../../lib/types";

@Entity()
export default class Product {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'varchar', length: 255})
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

    @Column({
        default: () => "CURRENT_TIMESTAMP",
        type: "timestamp"
    })
    public createdAt: Date;
}
