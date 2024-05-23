import { Entity, PrimaryGeneratedColumn, Column, Generated, Index, DeleteDateColumn } from "typeorm";

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

    @DeleteDateColumn()
    public deletedAt: Date;
}
