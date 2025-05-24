import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

interface UsuarioAttributes {
  id: number;
  email: string;
  senha: string;
  nomeCompleto: string;
  tipoPerfil: 'jovem' | 'rh' | 'gestor';
  avatarUrl?: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  dataNascimento?: Date;
  areasInteresse?: string[];
  habilidadesPrincipais?: string;
  cargoNaEmpresa?: string;
  empresaId?: number;
  linkedin?: string;
  github?: string;
  experiencia?: string;
  formacao?: string;
  onboardingCompleto: boolean;
  status: 'ativo' | 'inativo';
}

class Usuario extends Model<UsuarioAttributes> implements UsuarioAttributes {
  public id!: number;
  public email!: string;
  public senha!: string;
  public nomeCompleto!: string;
  public tipoPerfil!: 'jovem' | 'rh' | 'gestor';
  public avatarUrl?: string;
  public telefone?: string;
  public cidade?: string;
  public estado?: string;
  public bio?: string;
  public linkedinUrl?: string;
  public githubUrl?: string;
  public dataNascimento?: Date;
  public areasInteresse?: string[];
  public habilidadesPrincipais?: string;
  public cargoNaEmpresa?: string;
  public empresaId?: number;
  public linkedin?: string;
  public github?: string;
  public experiencia?: string;
  public formacao?: string;
  public onboardingCompleto!: boolean;
  public status!: 'ativo' | 'inativo';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para não retornar a senha em respostas JSON
  public toJSON() {
    const values = Object.assign({}, this.get());
    delete values.senha;
    return values;
  }

  // Verificar senha do usuário
  public async validarSenha(senha: string): Promise<boolean> {
    return bcrypt.compare(senha, this.senha);
  }

  // Helper method to define associations
  public static associate(models: any) {
    this.belongsTo(models.Empresa, { foreignKey: 'empresaId', as: 'empresa' });
    this.hasMany(models.Projeto, { foreignKey: 'usuarioId', as: 'projetos' });
    this.hasMany(models.Avaliacao, { foreignKey: 'avaliadorId', as: 'avaliacoes' });
    this.hasMany(models.Feedback, { foreignKey: 'gestorId', as: 'feedbacks' });
    this.hasMany(models.Convite, { foreignKey: 'jovemId', as: 'convites' });
    this.hasMany(models.Favorito, { foreignKey: 'gestorId', as: 'favoritos' });
    this.hasMany(models.Favorito, { foreignKey: 'talentoId', as: 'favoritadoPor' });
  }
}

export default (sequelize: Sequelize) => {
  Usuario.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nomeCompleto: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tipoPerfil: {
        type: DataTypes.ENUM('jovem', 'rh', 'gestor'),
        allowNull: false
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cidade: {
        type: DataTypes.STRING,
        allowNull: true
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      linkedinUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      githubUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      areasInteresse: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      habilidadesPrincipais: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      cargoNaEmpresa: {
        type: DataTypes.STRING,
        allowNull: true
      },
      empresaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'empresas',
          key: 'id'
        }
      },
      linkedin: {
        type: DataTypes.STRING,
        allowNull: true
      },
      github: {
        type: DataTypes.STRING,
        allowNull: true
      },
      experiencia: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      formacao: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      onboardingCompleto: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo'
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
      underscored: false,
      freezeTableName: false,
      hooks: {
        beforeCreate: async (usuario: any) => {
          if (usuario.senha) {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
          }
        },
        beforeUpdate: async (usuario: any) => {
          if (usuario.changed('senha') && usuario.senha) {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
          }
        }
      }
    }
  );
  return Usuario;
}; 