import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ nullable: false, unique: true, length: 24, default: 'Player' })
  login: string;

  @Column({ nullable: false, length: 50, default: '' })
  password: string;
}
