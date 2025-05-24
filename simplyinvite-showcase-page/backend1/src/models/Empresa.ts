import { Model, DataTypes, Sequelize } from 'sequelize';

interface EmpresaAttributes {
  id: number;
  nome: string;
  cnpj: string;
  descricao?: string;
  localizacao?: string;
  setor?: string;
}

class Empresa extends Model<EmpresaAttributes> implements EmpresaAttributes {
  public id!: number;
  public nome!: string;
  public cnpj!: string;
  public descricao?: string;
  public localizacao?: string;
  public setor?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to define associations
  public static associate(models: any) {
    this.hasMany(models.Usuario, { foreignKey: 'empresaId', as: 'usuarios' });
    // Add other associations if needed
  }
}

export default (sequelize: Sequelize) => {
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
      modelName: 'Empresa',
      tableName: 'empresas',
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  );
  return Empresa;
}; 