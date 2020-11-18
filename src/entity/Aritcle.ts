import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, getRepository, Unique, PrimaryColumn, CreateDateColumn } from "typeorm";
import User from "./User";

@Entity()
export default class Article {

    @PrimaryGeneratedColumn()
    article_id!: number;

    @Column()
    title!: string;

    @Column({ type: "text" })
    contents!: string;

    @Column()
    @CreateDateColumn()
    created_at!: Date;
  
    @Column()
    @CreateDateColumn()
    updated_at!: Date;

    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: "uid" })
    user!: User; 
}