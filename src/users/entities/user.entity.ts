import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, length: 24 })
  public username: string;

  @Column({ length: 60 })
  public password: string;

  @Column({ default: 0 })
  public image: number;
}
