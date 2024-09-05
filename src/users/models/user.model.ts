import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    allowNull: false,
  })
  password: string;
}
