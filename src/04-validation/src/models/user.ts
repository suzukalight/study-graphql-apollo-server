import { Model, Association, DataTypes, HasManyCreateAssociationMixin } from 'sequelize';

import { sequelize } from '../infrastructure/sequelize';
import Message from './message';

class User extends Model {
  public id!: number;
  public lastName!: string;
  public firstName!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly messages?: Message[];

  public createMessage!: HasManyCreateAssociationMixin<Message>;

  public static associations: {
    messages: Association<User, Message>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lastName: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    sequelize: sequelize,
  },
);

User.hasMany(Message, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'messages',
});

export default User;
