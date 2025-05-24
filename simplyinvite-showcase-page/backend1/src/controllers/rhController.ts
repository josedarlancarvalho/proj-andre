import { Request, Response } from 'express';
import db from '../models';
import { Op } from 'sequelize';
import { RequestHandler } from '../types/controller';

// Tipos de resposta para melhor tipagem
interface EstatisticasRH {
  avaliacoesTotal: number;
  medalhas: {
    ouro: number;
    prata: number;
    bronze: number;
  };
  projetosPendentes: number;
}

// Buscar projetos pendentes
export const buscarProjetosPendentes: RequestHandler = async (req, res) => {
  try {
    const projetos = await db.Projeto.findAll({
      where: { status: 'pendente' },
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id', 'nomeCompleto', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar projetos pendentes' });
  }
};

// Buscar histórico de avaliações
export const buscarHistoricoAvaliacoes: RequestHandler = async (req, res) => {
  try {
    const avaliadorId = (req as any).usuario.id;
    const avaliacoes = await db.Avaliacao.findAll({
      where: { avaliadorId },
      include: [
        {
          model: db.Projeto,
          as: 'projeto',
          include: [
            {
              model: db.Usuario,
              as: 'usuario',
              attributes: ['id', 'nomeCompleto', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar histórico de avaliações' });
  }
};

// Avaliar projeto
export const avaliarProjeto: RequestHandler = async (req, res) => {
  try {
    const { projetoId } = req.params;
    const { nota, comentario, medalha } = req.body;
    const avaliadorId = (req as any).usuario.id;

    const projeto = await db.Projeto.findByPk(parseInt(projetoId, 10));
    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const avaliacao = await db.Avaliacao.create({
      projetoId: parseInt(projetoId, 10),
      avaliadorId,
      nota,
      comentario,
      medalha
    });

    await projeto.update({ status: 'avaliado' });

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao avaliar projeto' });
  }
};

// Encaminhar avaliação para gestor
export const encaminharParaGestor: RequestHandler = async (req, res) => {
  try {
    const { avaliacaoId } = req.params;
    const avaliacao = await db.Avaliacao.findByPk(parseInt(avaliacaoId, 10));

    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }

    await avaliacao.update({ encaminhadoParaGestor: true });

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao encaminhar avaliação para gestor' });
  }
};

// Buscar estatísticas
export const buscarEstatisticas: RequestHandler = async (req, res) => {
  try {
    const avaliadorId = (req as any).usuario.id;

    const estatisticas = {
      totalAvaliacoes: await db.Avaliacao.count({ where: { avaliadorId } }),
      projetosAvaliados: await db.Projeto.count({
        where: { status: 'avaliado' },
        include: [
          {
            model: db.Avaliacao,
            as: 'avaliacoes',
            where: { avaliadorId },
            required: true
          }
        ]
      }),
      avaliacoesEncaminhadas: await db.Avaliacao.count({
        where: {
          avaliadorId,
          encaminhadoParaGestor: true
        }
      }),
      medalhasDistribuidas: await db.Avaliacao.count({
        where: {
          avaliadorId,
          medalha: { [Op.not]: null }
        }
      })
    };

    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

// Buscar projeto específico
export const buscarProjeto: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const projeto = await db.Projeto.findOne({
      where: { id: parseInt(id, 10) },
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id', 'nomeCompleto', 'email']
        },
        {
          model: db.Avaliacao,
          as: 'avaliacoes'
        }
      ]
    });
    
    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }
    
    return res.json(projeto);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar projeto' });
  }
};

// Buscar perfil
export const buscarPerfil: RequestHandler = async (req, res) => {
  try {
    const usuarioId = (req as any).usuario.id;
    const usuario = await db.Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: db.Empresa,
          as: 'empresa'
        }
      ]
    });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar perfil' });
  }
};

// Atualizar perfil
export const atualizarPerfil: RequestHandler = async (req, res) => {
  try {
    const usuarioId = (req as any).usuario.id;
    const usuario = await db.Usuario.findByPk(usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    await usuario.update(req.body);
    
    const usuarioAtualizado = await db.Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: db.Empresa,
          as: 'empresa'
        }
      ]
    });
    
    return res.json(usuarioAtualizado);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

// Buscar relatórios
export const buscarRelatorios: RequestHandler = async (req, res) => {
  try {
    const avaliadorId = (req as any).usuario.id;
    
    const relatorios = {
      avaliacoesPorMes: await db.Avaliacao.findAll({
        where: { avaliadorId },
        attributes: [
          [db.sequelize.fn('date_trunc', 'month', db.sequelize.col('createdAt')), 'mes'],
          [db.sequelize.fn('count', '*'), 'total']
        ],
        group: [db.sequelize.fn('date_trunc', 'month', db.sequelize.col('createdAt'))]
      }),
      
      distribuicaoMedalhas: await db.Avaliacao.findAll({
        where: { avaliadorId },
        attributes: [
          'medalha',
          [db.sequelize.fn('count', '*'), 'total']
        ],
        group: ['medalha']
      }),
      
      projetosAvaliados: await db.Projeto.count({
        where: { status: 'avaliado' },
        include: [
          {
            model: db.Avaliacao,
            as: 'avaliacoes',
            where: { avaliadorId },
            required: true
          }
        ]
      })
    };
    
    return res.json(relatorios);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar relatórios' });
  }
}; 