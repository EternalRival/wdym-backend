import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tusers')
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, length: 24 })
  public username: string;

  @Column({ length: 60 })
  public password: string;

  @Column({ default: 'https://i.imgur.com/Hemekr4.png' })
  public image: string;
}
