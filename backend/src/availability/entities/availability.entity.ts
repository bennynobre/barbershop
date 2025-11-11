import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne,
  JoinColumn,
  Unique 
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'availabilities' })
@Unique(['profissional_id', 'dia_da_semana']) 
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  profissional_id: string;

  @ManyToOne(() => User, (user) => user.agendamentosComoProfissional)
  @JoinColumn({ name: 'profissional_id' })
  profissional: User;

  @Column({ type: 'int' })
  dia_da_semana: number;

  @Column({ type: 'time' })
  hora_inicio: string; 

  @Column({ type: 'time' })
  hora_fim: string; 

  @Column({ default: true })
  ativo: boolean;
}