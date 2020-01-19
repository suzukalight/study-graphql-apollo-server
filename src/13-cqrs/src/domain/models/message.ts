import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../../infrastructure/sequelize';

class Message extends Model {
  public id!: number;
  public text!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING(65500),
      validate: {
        notEmpty: {
          msg: 'A message has to have a text.',
        },
      },
    },
  },
  {
    tableName: 'messages',
    sequelize: sequelize,
  },
);

export default Message;
