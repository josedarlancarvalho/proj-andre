import { Model, DataTypes, Sequelize } from 'sequelize';

interface ProjetoAttributes {
  id: number;
  titulo: string;
  descricao: string;
  tecnologias: string[];
  linkRepositorio?: string;
  linkDeploy?: string;
  status: 'pendente' | 'avaliado' | 'destacado';
  usuarioId: number;
}

class Projeto extends Model<ProjetoAttributes> implements ProjetoAttributes {
  public id!: number;
  public titulo!: string;
  public descricao!: string;
  public tecnologias!: string[];
  public linkRepositorio?: string;
  public linkDeploy?: string;
  public status!: 'pendente' | 'avaliado' | 'destacado';
  public usuarioId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to define associations
  public static associate(models: any) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    this.hasMany(models.Avaliacao, { foreignKey: 'projetoId', as: 'avaliacoes' });
    this.hasMany(models.Feedback, { foreignKey: 'projetoId', as: 'feedbacks' });
  }
}

export default (sequelize: Sequelize) => {
  Projeto.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tecnologias: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      linkRepositorio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkDeploy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pendente', 'avaliado', 'destacado'),
        allowNull: false,
        defaultValue: 'pendente',
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Projeto',
      tableName: 'projetos',
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  );
  return Projeto;
}; 