'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Criar tabela de projetos
    await queryInterface.createTable('projetos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tecnologias: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
      linkRepositorio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linkDeploy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pendente', 'avaliado', 'destacado'),
        allowNull: false,
        defaultValue: 'pendente',
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela de avaliações
    await queryInterface.createTable('avaliacoes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projetoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projetos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      avaliadorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 10,
        },
      },
      comentario: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      medalha: {
        type: Sequelize.ENUM('ouro', 'prata', 'bronze'),
        allowNull: true,
      },
      encaminhadoParaGestor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('avaliacoes');
    await queryInterface.dropTable('projetos');
  }
}; 