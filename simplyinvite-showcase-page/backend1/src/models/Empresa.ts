import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Empresa extends Model {
  public id!: number;
  public nome!: string;
  public cnpj!: string;
  public descricao?: string;
  public localizacao?: string;
  public setor?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Empresa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    localizacao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    setor: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'empresa',
    tableName: 'empresas'
  }
);

export default Empresa; 