import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
  public id!: number;
  public email!: string;
  public senha!: string;
  public nomeCompleto!: string;
  public tipoPerfil!: string; // talent, hr, manager
  public avatarUrl?: string;
  public telefone?: string;
  public cidade?: string;
  public estado?: string;
  public bio?: string;
  public linkedinUrl?: string;
  public githubUrl?: string;
  public dataNascimento?: Date;
  public areasInteresse?: string;
  public habilidadesPrincipais?: string;
  public cargoNaEmpresa?: string;
  public empresaId?: number;
  public onboardingComplete!: boolean;
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
}

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
      type: DataTypes.STRING, // 'talent', 'hr', 'manager'
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
      type: DataTypes.STRING(1000),
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
    onboardingComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuarios',
    hooks: {
      beforeCreate: async (usuario: Usuario) => {
        if (usuario.senha) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      },
      beforeUpdate: async (usuario: Usuario) => {
        // Somente faz hash da senha se ela foi alterada
        if (usuario.changed('senha') && usuario.senha) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      }
    }
  }
);

export default Usuario; 