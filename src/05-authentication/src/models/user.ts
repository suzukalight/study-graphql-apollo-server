import { Model, Association, DataTypes, HasManyCreateAssociationMixin } from 'sequelize';
import bcrypt from 'bcrypt';

import { sequelize } from '../infrastructure/sequelize';
import Message from './message';

class User extends Model {
  public id!: number;
  public lastName!: string;
  public firstName!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly messages?: Message[];

  public createMessage!: HasManyCreateAssociationMixin<Message>;

  public static findByEmail: (email: string) => Promise<User | null>;
  public validatePassword!: (password: string) => Promise<boolean>;

  public static associations: {
    messages: Association<User, Message>;
  };
}

const generatePasswordHash = async (user: User) => {
  const saltRounds = 10;
  return await bcrypt.hash(user.password, saltRounds);
};

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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
  },
  {
    tableName: 'users',
    sequelize: sequelize,
    hooks: {
      beforeCreate: async user => {
        user.set('password', await generatePasswordHash(user));
      },
    },
  },
);

User.hasMany(Message, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'messages',
});

User.findByEmail = async (email: string) =>
  User.findOne({
    where: { email },
  });

User.prototype.validatePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
};

export default User;
