import { Request, Response } from 'express';
import { db } from '../config/database';

export const getExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await db
      .from('Experiance')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      count: data?.length || 0,
      data: data || []
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while fetching experiences.'
    });
  }
};

export const createExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      company_name,
      job_role,
      start_date,
      end_date,
      currently_working,
      description_job,
      technical_stacks,
      project_description
    } = req.body;

    if (!company_name || !job_role || !start_date || !description_job) {
      res.status(400).json({
        success: false,
        message: 'Validation Error: Company name, job role, start date, and description are required.'
      });
      return;
    }

    const newExperience = {
      company_name,
      job_role,
      start_date,
      end_date: currently_working ? null : end_date,
      currently_working: currently_working || false,
      description_job,
      technical_stacks: technical_stacks || [],
      project_description: project_description || []
    };

    const { data, error } = await db
      .from('Experiance')
      .insert([newExperience])
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Experience successfully created.',
      data: data ? data[0] : null
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while creating experience.'
    });
  }
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      company_name,
      job_role,
      start_date,
      end_date,
      currently_working,
      description_job,
      technical_stacks,
      project_description
    } = req.body;

    const updatedExperience = {
      company_name,
      job_role,
      start_date,
      end_date: currently_working ? null : end_date,
      currently_working: currently_working || false,
      description_job,
      technical_stacks: technical_stacks || [],
      project_description: project_description || []
    };

    const { data, error } = await db
      .from('Experiance')
      .update(updatedExperience)
      .eq('id', id)
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Experience successfully updated.',
      data: data ? data[0] : null
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while updating experience.'
    });
  }
};

export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await db
      .from('Experiance')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Experience successfully deleted.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while deleting experience.'
    });
  }
};
