import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import UsuarioModel from './Usuario';
import EmpresaModel from './Empresa';
import ProjetoModel from './Projeto';
import AvaliacaoModel from './Avaliacao';
import FeedbackModel from './Feedback';
import FavoritoModel from './Favorito';
import ConviteModel from './Convite';

const Usuario = UsuarioModel(sequelize);
const Empresa = EmpresaModel(sequelize);
const Projeto = ProjetoModel(sequelize);
const Avaliacao = AvaliacaoModel(sequelize);
const Feedback = FeedbackModel(sequelize);
const Favorito = FavoritoModel(sequelize);
const Convite = ConviteModel(sequelize);

// Definir associações
Usuario.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });
Empresa.hasMany(Usuario, { foreignKey: 'empresaId', as: 'usuarios' });

Usuario.hasMany(Projeto, { foreignKey: 'usuarioId', as: 'projetos' });
Projeto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

Projeto.hasMany(Avaliacao, { foreignKey: 'projetoId', as: 'avaliacoes' });
Avaliacao.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'projeto' });

Projeto.hasMany(Feedback, { foreignKey: 'projetoId', as: 'feedbacks' });
Feedback.belongsTo(Projeto, { foreignKey: 'projetoId', as: 'projeto' });

Usuario.hasMany(Favorito, { foreignKey: 'gestorId', as: 'favoritos' });
Favorito.belongsTo(Usuario, { foreignKey: 'gestorId', as: 'gestor' });
Favorito.belongsTo(Usuario, { foreignKey: 'talentoId', as: 'talento' });

// Associações do Convite
Usuario.hasMany(Convite, { foreignKey: 'jovemId', as: 'convitesRecebidos' });
Empresa.hasMany(Convite, { foreignKey: 'empresaId', as: 'convitesEnviados' });
Convite.belongsTo(Usuario, { foreignKey: 'jovemId', as: 'jovem' });
Convite.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

export default {
  Usuario,
  Empresa,
  Projeto,
  Avaliacao,
  Feedback,
  Favorito,
  Convite,
}; 