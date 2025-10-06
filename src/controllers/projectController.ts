import { Request, Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await pool.query(
      `INSERT INTO projects (name, description, owner_id) 
       VALUES (R1, R2, R3) 
       RETURNING id, name, description, owner_id, created_at, updated_at`,
      [name, description, ownerId]
    );

    const project = result.rows[0];

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await pool.query(
      `SELECT DISTINCT p.*, u.name as owner_name
       FROM projects p
       LEFT JOIN users u ON p.owner_id = u.id
       LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = R1
       WHERE p.owner_id = R1 OR pm.user_id = R1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({
      projects: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
