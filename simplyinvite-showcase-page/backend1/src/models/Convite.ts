import { Model, DataTypes, Sequelize } from 'sequelize';

interface ConviteAttributes {
  id: number;
  empresaId: number;
  jovemId: number;
  status: 'pendente' | 'aceito' | 'recusado';
  mensagem?: string;
}

class Convite extends Model<ConviteAttributes> implements ConviteAttributes {
  public id!: number;
  public empresaId!: number;
  public jovemId!: number;
  public status!: 'pendente' | 'aceito' | 'recusado';
  public mensagem?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to define associations
  public static associate(models: any) {
    this.belongsTo(models.Usuario, { foreignKey: 'jovemId', as: 'jovem' });
    this.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' });
    // Add other associations if needed, e.g. if a convite is tied to a specific Projeto
    // this.belongsTo(models.Projeto, { foreignKey: 'projetoId', as: 'projeto' }); 
  }
}

export default (sequelize: Sequelize) => {
  Convite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      empresaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'empresas',
          key: 'id',
        },
      },
      jovemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('pendente', 'aceito', 'recusado'),
        allowNull: false,
        defaultValue: 'pendente',
      },
      mensagem: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Convite',
      tableName: 'convites',
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  );
  return Convite;
}; 