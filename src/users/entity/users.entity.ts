import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ nullable: false, unique: true, length: 24 })
  username: string;

  @Column({ nullable: false, length: 60 })
  password: string;

  @Column({ default: 'https://i.imgur.com/Hemekr4.png' })
  image: string;
}
