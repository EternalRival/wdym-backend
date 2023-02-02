import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ nullable: false, unique: true, length: 24 })
  username: string;

  @Column({ nullable: false, length: 60 })
  password: string;
}
