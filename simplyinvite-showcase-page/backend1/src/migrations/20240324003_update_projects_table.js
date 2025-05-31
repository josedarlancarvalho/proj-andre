'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remover coluna linkDeploy
    await queryInterface.removeColumn('projetos', 'linkDeploy');

    // Adicionar coluna linkYoutube
    await queryInterface.addColumn('projetos', 'linkYoutube', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Link do vídeo do YouTube explicando o projeto'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover coluna linkYoutube
    await queryInterface.removeColumn('projetos', 'linkYoutube');

    // Adicionar coluna linkDeploy de volta
    await queryInterface.addColumn('projetos', 'linkDeploy', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
}; 