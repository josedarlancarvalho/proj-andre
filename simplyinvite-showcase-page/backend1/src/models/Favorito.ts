import { Model, DataTypes, Sequelize } from 'sequelize';

interface FavoritoAttributes {
  id: number;
  gestorId: number;
  talentoId: number;
}

class Favorito extends Model<FavoritoAttributes> implements FavoritoAttributes {
  public id!: number;
  public gestorId!: number;
  public talentoId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to define associations
  public static associate(models: any) {
    this.belongsTo(models.Usuario, { foreignKey: 'gestorId', as: 'gestor' });
    this.belongsTo(models.Usuario, { foreignKey: 'talentoId', as: 'talento' });
  }
}

export default (sequelize: Sequelize) => {
  Favorito.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gestorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
      },
      talentoId: {
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
      modelName: 'Favorito',
      tableName: 'favoritos',
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  );
  return Favorito;
}; 