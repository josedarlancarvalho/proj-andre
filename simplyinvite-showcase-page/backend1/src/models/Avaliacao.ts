import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Usuario from './Usuario';
import Projeto from './Projeto';

class Avaliacao extends Model {
  public id!: number;
  public nota!: number;
  public comentario?: string;
  public dataAvaliacao!: Date;
  public avaliadorId!: number;
  public projetoId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Avaliacao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dataAvaliacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    avaliadorId: {
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
    modelName: 'avaliacao',
    tableName: 'avaliacoes'
  }
);

// Define relações
Avaliacao.belongsTo(Usuario, { foreignKey: 'avaliadorId', as: 'avaliador' });
Avaliacao.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'projeto' });

export default Avaliacao; 