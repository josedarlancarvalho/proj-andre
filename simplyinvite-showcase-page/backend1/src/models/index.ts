import { Sequelize } from 'sequelize';
import sequelize from '../config/database';

// Import models
import Usuario from './Usuario';
import Empresa from './Empresa';
import Projeto from './Projeto';
import Avaliacao from './Avaliacao';
import Convite from './Convite';
import Feedback from './Feedback';
import Favorito from './Favorito';

// Initialize models
const models = {
  Usuario: Usuario(sequelize),
  Empresa: Empresa(sequelize),
  Projeto: Projeto(sequelize),
  Avaliacao: Avaliacao(sequelize),
  Convite: Convite(sequelize),
  Feedback: Feedback(sequelize),
  Favorito: Favorito(sequelize)
};

// Run associations
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default {
  sequelize,
  Sequelize,
  ...models
}; 