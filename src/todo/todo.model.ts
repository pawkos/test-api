import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../auth/user.model';

@Table
export class Todo extends Model {
  @Column
  title: string;

  @Column({ defaultValue: false })
  isCompleted: boolean;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}