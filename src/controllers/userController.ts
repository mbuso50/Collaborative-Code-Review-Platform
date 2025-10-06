import { Request, Response } from 'express';
import { pool } from '../config/database';
import { User } from '../types';

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);

        const result = await pool.query(
            `SELECT id, email, name, role, display_picture, created_at, updated_at 
       FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        const { name, display_picture } = req.body;

        // Check if user exists
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await pool.query(
            `UPDATE users 
       SET name = $1, display_picture = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING id, email, name, role, display_picture, created_at, updated_at`,
            [name, display_picture, userId]
        );

        const updatedUser = result.rows[0];
        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT id, email, name, role, display_picture, created_at 
       FROM users 
       ORDER BY created_at DESC`
        );

        res.json({
            users: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};