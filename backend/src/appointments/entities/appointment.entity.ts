import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn 
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Service } from 'src/services/entities/service.entity'; 

export enum AppointmentStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  CANCELADO = 'CANCELADO',
}

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cliente_id: string; 

  @ManyToOne(() => User) 
  @JoinColumn({ name: 'cliente_id' })
  cliente: User;

  @Column({ type: 'uuid' })
  profissional_id: string;

  @ManyToOne(() => User) 
  @JoinColumn({ name: 'profissional_id' })
  profissional: User;

  @Column({ type: 'uuid' })
  servico_id: string; 

  @ManyToOne(() => Service) 
  @JoinColumn({ name: 'servico_id' })
  servico: Service;

  @Column({ type: 'timestamp with time zone' })
  data_hora_inicio: Date;

  @Column({ type: 'timestamp with time zone' })
  data_hora_fim: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDENTE,
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}