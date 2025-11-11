import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from 'typeorm';

import { Appointment } from 'src/appointments/entities/appointment.entity';

@Entity({ name: 'services' }) 
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 100 })
  nome: string; 

  @Column({ nullable: false })
  duracao_minutos: number; 

  @Column({ 
    type: 'decimal', 
    precision: 10,  
    scale: 2,       
    nullable: false 
  })
  preco: number; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.servico)
  agendamentos: Appointment[];
}