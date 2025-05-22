import Usuario from './Usuario';
import Empresa from './Empresa';
import Projeto from './Projeto';
import Avaliacao from './Avaliacao';
import Convite from './Convite';
import sequelize from '../config/database';

// Associações entre modelos

// Empresa tem muitos Usuários (RH/Gestores)
Empresa.hasMany(Usuario, { foreignKey: 'empresaId', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

// Usuario tem muitos Projetos
Usuario.hasMany(Projeto, { foreignKey: 'usuarioId', as: 'projetos' });

// Usuario tem muitas Avaliações (como avaliador)
Usuario.hasMany(Avaliacao, { foreignKey: 'avaliadorId', as: 'avaliacoesFeitas' });

// Projeto tem muitas Avaliações
Projeto.hasMany(Avaliacao, { foreignKey: 'projetoId', as: 'avaliacoes' });

// Convites já têm suas associações definidas no próprio modelo

export {
  sequelize,
  Usuario,
  Empresa,
  Projeto,
  Avaliacao,
  Convite
}; 