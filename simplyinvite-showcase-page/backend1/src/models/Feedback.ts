import { Model, DataTypes, Sequelize } from 'sequelize';

interface Oportunidade {
  tipo: 'estagio' | 'trainee' | 'junior';
  descricao: string;
}

interface FeedbackAttributes {
  id: number;
  projetoId: number;
  gestorId: number;
  comentario: string;
  oportunidade?: Oportunidade;
}

class Feedback extends Model<FeedbackAttributes> implements FeedbackAttributes {
  public id!: number;
  public projetoId!: number;
  public gestorId!: number;
  public comentario!: string;
  public oportunidade?: Oportunidade;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to define associations
  public static associate(models: any) {
    this.belongsTo(models.Projeto, { foreignKey: 'projetoId', as: 'projeto' });
    this.belongsTo(models.Usuario, { foreignKey: 'gestorId', as: 'gestor' });
    // Add other associations if needed
  }
}

export default (sequelize: Sequelize) => {
  Feedback.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projetoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'projetos',
          key: 'id',
        },
      },
      gestorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      oportunidade: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Feedback',
      tableName: 'feedbacks',
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  );
  return Feedback;
}; 