'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('feedbacks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      projetoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projetos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      gestorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      oportunidade: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Índices para melhor performance
    await queryInterface.addIndex('feedbacks', ['projetoId']);
    await queryInterface.addIndex('feedbacks', ['gestorId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('feedbacks');
  }
}; 