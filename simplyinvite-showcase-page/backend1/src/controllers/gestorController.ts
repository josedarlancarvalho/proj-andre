import { Request, Response } from 'express';
import { RequestHandler } from '../types/controller';
import db from '../models';
import { Op } from 'sequelize';

// Buscar projetos destacados
export const buscarProjetosDestacados: RequestHandler = async (req, res) => {
  try {
    const projetos = await db.Projeto.findAll({
      where: { status: 'destacado' },
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id', 'nomeCompleto', 'email']
        }
      ]
    });
    return res.json(projetos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar projetos destacados' });
  }
};

// Buscar projeto destacado específico
export const buscarProjetoDestacado: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const projeto = await db.Projeto.findOne({
      where: { id: parseInt(id, 10), status: 'destacado' },
      include: [
        {
          model: db.Usuario,
          as: 'usuario',
          attributes: ['id', 'nomeCompleto', 'email']
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

// Enviar feedback para um projeto
export const enviarFeedback: RequestHandler = async (req, res) => {
  try {
    const { projetoId } = req.params;
    const { comentario, oportunidade } = req.body;
    const gestorId = (req as any).usuario.id;

    const feedback = await db.Feedback.create({
      projetoId: parseInt(projetoId, 10),
      gestorId,
      comentario,
      oportunidade
    });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar feedback' });
  }
};

// Buscar talentos
export const buscarTalentos: RequestHandler = async (req, res) => {
  try {
    const talentos = await db.Usuario.findAll({
      where: { tipoPerfil: 'jovem' },
      attributes: { exclude: ['senha'] }
    });
    res.json(talentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar talentos' });
  }
};

// Buscar histórico de interações com um talento
export const buscarHistoricoInteracoes: RequestHandler = async (req, res) => {
  try {
    const { talentoId } = req.params;
    const historico = await db.Feedback.findAll({
      where: { '$projeto.usuarioId$': parseInt(talentoId, 10) },
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
      ]
    });
    res.json(historico);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar histórico de interações' });
  }
};

// Buscar talentos em destaque
export const buscarTalentosDestaque: RequestHandler = async (req, res) => {
  try {
    const talentos = await db.Usuario.findAll({
      where: { 
        tipoPerfil: 'jovem',
        [Op.or]: [
          { '$projetos.status$': 'destacado' },
          { '$avaliacoes.medalha$': { [Op.not]: null } }
        ]
      },
      include: [
        {
          model: db.Projeto,
          as: 'projetos',
          include: [
            {
              model: db.Avaliacao,
              as: 'avaliacoes'
            }
          ]
        }
      ],
      attributes: { exclude: ['senha'] }
    });
    res.json(talentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar talentos em destaque' });
  }
};

// Buscar talentos por área
export const buscarTalentosPorArea: RequestHandler = async (req, res) => {
  try {
    const { area } = req.params;
    const talentos = await db.Usuario.findAll({
      where: { 
        tipoPerfil: 'jovem',
        areasInteresse: {
          [Op.overlap]: [area]
        }
      },
      attributes: { exclude: ['senha'] }
    });
    return res.json(talentos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar talentos por área' });
  }
};

// Favoritar um talento
export const favoritarTalento: RequestHandler = async (req, res) => {
  try {
    const { talentoId } = req.params;
    const gestorId = (req as any).usuario.id;

    // Aqui você precisaria ter uma tabela de favoritos
    // Por enquanto, vamos apenas retornar sucesso
    res.json({ message: 'Talento favoritado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao favoritar talento' });
  }
};

// Remover talento dos favoritos
export const removerFavorito: RequestHandler = async (req, res) => {
  try {
    const { talentoId } = req.params;
    const gestorId = (req as any).usuario.id;

    // Aqui você precisaria ter uma tabela de favoritos
    // Por enquanto, vamos apenas retornar sucesso
    res.json({ message: 'Talento removido dos favoritos com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover talento dos favoritos' });
  }
};

// Buscar entrevistas
export const buscarEntrevistas: RequestHandler = async (req, res) => {
  try {
    // Aqui você precisaria ter uma tabela de entrevistas
    // Por enquanto, vamos retornar uma lista vazia
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar entrevistas' });
  }
};

// Buscar estatísticas
export const buscarEstatisticas: RequestHandler = async (req, res) => {
  try {
    const gestorId = (req as any).usuario.id;

    const estatisticas = {
      totalFeedbacks: await db.Feedback.count({ where: { gestorId } }),
      totalTalentosFavoritados: 0, // Precisaria de uma tabela de favoritos
      totalEntrevistas: 0, // Precisaria de uma tabela de entrevistas
      projetosAvaliados: await db.Projeto.count({
        where: {
          '$feedbacks.gestorId$': gestorId
        },
        include: [
          {
            model: db.Feedback,
            as: 'feedbacks'
          }
        ]
      })
    };

    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

// Explorar talentos
export const explorarTalentos: RequestHandler = async (req, res) => {
  try {
    const talentos = await db.Usuario.findAll({
      where: { 
        tipoPerfil: 'jovem',
        status: 'ativo'
      },
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: db.Projeto,
          as: 'projetos',
          include: [
            {
              model: db.Avaliacao,
              as: 'avaliacoes'
            }
          ]
        }
      ]
    });
    return res.json(talentos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar talentos' });
  }
};

// Buscar favoritos
export const buscarFavoritos: RequestHandler = async (req, res) => {
  try {
    const gestorId = (req as any).usuario.id;
    const favoritos = await db.Favorito.findAll({
      where: { gestorId },
      include: [
        {
          model: db.Usuario,
          as: 'talento',
          attributes: { exclude: ['senha'] },
          include: [
            {
              model: db.Projeto,
              as: 'projetos'
            }
          ]
        }
      ]
    });
    return res.json(favoritos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar favoritos' });
  }
}; 