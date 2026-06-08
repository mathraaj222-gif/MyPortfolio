import { Request, Response } from 'express';
import { db } from '../config/database';

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await db
      .from('Skills')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      count: data?.length || 0,
      data: data || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error fetching skills.' });
  }
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill_name, skill_image_url } = req.body;

    if (!skill_name) {
      res.status(400).json({ success: false, message: 'Validation Error: Skill name is mandatory.' });
      return;
    }

    const newSkill = { skill_name, skill_image_url };

    const { data, error } = await db
      .from('Skills')
      .insert([newSkill])
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'New skill successfully registered into your profile.',
      data: data ? data[0] : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error writing skill context.' });
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await db
      .from('Skills')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Skill successfully deleted.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error deleting skill.' });
  }
};