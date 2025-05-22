import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Usuario from './Usuario';

class Projeto extends Model {
  public id!: number;
  public titulo!: string;
  public descricao!: string;
  public categoria?: string;
  public thumbnailUrl?: string;
  public videoUrl?: string;
  public linkProjetoExterno?: string;
  public statusSubmissao?: string; // pendente, aprovado, rejeitado
  public dataEnvio?: Date;
  public usuarioId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Projeto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkProjetoExterno: {
      type: DataTypes.STRING,
      allowNull: true
    },
    statusSubmissao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataEnvio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'projeto',
    tableName: 'projetos'
  }
);

// Define relações
Projeto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

export default Projeto; 