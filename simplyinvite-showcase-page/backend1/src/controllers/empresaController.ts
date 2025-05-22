import { Request, Response } from 'express';
import { Empresa, Usuario } from '../models';

export const getAll = async (_req: Request, res: Response) => {
  try {
    const empresas = await Empresa.findAll();
    return res.json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const empresa = await Empresa.findByPk(id, {
      include: [{ 
        model: Usuario, 
        as: 'usuarios',
        attributes: { exclude: ['senha'] }
      }]
    });
    
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    
    return res.json(empresa);
  } catch (error) {
    console.error(`Erro ao buscar empresa ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { nome, cnpj, descricao, localizacao, setor } = req.body;

    // Validar campos obrigatórios
    if (!nome || !cnpj) {
      return res.status(400).json({ message: 'Nome e CNPJ são obrigatórios' });
    }

    // Verificar se já existe empresa com o mesmo CNPJ
    const empresaExistente = await Empresa.findOne({ where: { cnpj } });
    if (empresaExistente) {
      return res.status(400).json({ message: 'Já existe uma empresa com este CNPJ' });
    }

    // Criar a empresa
    const empresa = await Empresa.create({
      nome,
      cnpj,
      descricao,
      localizacao,
      setor
    });

    return res.status(201).json(empresa);
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se a empresa existe
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    // Atualizar a empresa
    await empresa.update(req.body);
    
    // Retornar a empresa atualizada
    const empresaAtualizada = await Empresa.findByPk(id);
    
    return res.json(empresaAtualizada);
  } catch (error) {
    console.error(`Erro ao atualizar empresa ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se a empresa existe
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    
    // Verificar se existem usuários vinculados à empresa
    const usuarios = await Usuario.findOne({ where: { empresaId: id } });
    if (usuarios) {
      return res.status(400).json({ 
        message: 'Não é possível excluir esta empresa pois existem usuários vinculados a ela' 
      });
    }
    
    // Remover a empresa
    await empresa.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error(`Erro ao remover empresa ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 