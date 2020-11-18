import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    UpdateDateColumn,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
    PrimaryColumn
  } from 'typeorm';
  import User from './User';
  
  @Entity('auth_tokens')
  export default class AuthToken {

    @Column('id')
    @PrimaryColumn()
    fk_user_id!: string;
  
    @Column()
    @CreateDateColumn()
    created_at!: Date;
  
    @Column()
    @UpdateDateColumn()
    updated_at!: Date;
  
    @Column({ default: false })
    disabled!: boolean;
  
    @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_user_id' })
    user!: User;
  }