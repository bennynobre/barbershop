import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Availability } from 'src/availability/entities/availability.entity';

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

  @OneToMany(() => Appointment, (appointment) => appointment.cliente)
  agendamentosComoCliente: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.profissional)
  agendamentosComoProfissional: Appointment[];

  @OneToMany(() => Availability, (availability) => availability.profissional)
  disponibilidades: Availability[];
}