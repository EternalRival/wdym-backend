import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number;

  @Column({ nullable: false, unique: true, length: 24 })
  public username: string;

  @Column({ nullable: false, length: 60 })
  public password: string;

  @Column({ default: 'https://i.imgur.com/Hemekr4.png' })
  public image: string;
}
