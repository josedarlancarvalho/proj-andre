import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Usuario from './Usuario';
import Projeto from './Projeto';

export enum StatusConvite {
  PENDENTE = 'PENDENTE',
  ACEITO = 'ACEITO',
  REJEITADO = 'REJEITADO'
}

class Convite extends Model {
  public id!: number;
  public mensagem?: string;
  public status!: StatusConvite;
  public dataEnvio!: Date;
  public dataResposta?: Date;
  public remetenteId!: number;
  public destinatarioId!: number;
  public projetoId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Convite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDENTE', 'ACEITO', 'REJEITADO'),
      allowNull: false,
      defaultValue: 'PENDENTE'
    },
    dataEnvio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    dataResposta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remetenteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id'
      }
    },
    destinatarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: 'id'
      }
    },
    projetoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Projeto,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'convite',
    tableName: 'convites'
  }
);

// Define relações
Convite.belongsTo(Usuario, { foreignKey: 'remetenteId', as: 'remetente' });
Convite.belongsTo(Usuario, { foreignKey: 'destinatarioId', as: 'destinatario' });
Convite.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'projeto' });

export default Convite; 