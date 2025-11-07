import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' }) 
export class User {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false, unique: true }) 
  email: string;

  @Column({ nullable: false, select: false }) 
  password: string; 

  @Column({
    type: 'enum',
    enum: ['CLIENTE', 'PROFISSIONAL'],
    default: 'CLIENTE',
  })
  role: string;

  @CreateDateColumn() 
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}