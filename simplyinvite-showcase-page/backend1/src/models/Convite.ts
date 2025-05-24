import { Model, DataTypes, Sequelize } from 'sequelize';

interface ConviteAttributes {
  id: number;
  jovemId: number;
  empresaId: number;
  status: 'pendente' | 'aceito' | 'recusado';
  mensagem?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Convite extends Model<ConviteAttributes> implements ConviteAttributes {
  public id!: number;
  public jovemId!: number;
  public empresaId!: number;
  public status!: 'pendente' | 'aceito' | 'recusado';
  public mensagem?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Métodos de instância
  public async aceitar() {
    this.status = 'aceito';
    return this.save();
  }

  public async recusar() {
    this.status = 'recusado';
    return this.save();
  }

  public isPendente() {
    return this.status === 'pendente';
  }

  public isAceito() {
    return this.status === 'aceito';
  }

  public isRecusado() {
    return this.status === 'recusado';
  }

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
      jovemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id',
        },
      },
      empresaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Empresas',
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
      // Hooks
      hooks: {
        beforeCreate: (convite: Convite) => {
          if (!convite.status) {
            convite.status = 'pendente';
          }
        }
      }
    }
  );

  return Convite;
}; 