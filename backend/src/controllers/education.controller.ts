import { Request, Response } from 'express';
import { db } from '../config/database';

export const getEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await db
      .from('Education')
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
      message: 'Internal Server Error encountered while fetching education records.'
    });
  }
};

export const createEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      course_name,
      university_name,
      uni_state,
      uni_country,
      start_date,
      end_date,
      cgpa,
      currently_studying
    } = req.body;

    if (!course_name || !university_name || !uni_state || !uni_country || !start_date) {
      res.status(400).json({
        success: false,
        message: 'Validation Error: Course name, university name, state, country, and start date are required.'
      });
      return;
    }

    const newEducation = {
      course_name,
      university_name,
      uni_state,
      uni_country,
      start_date,
      end_date: currently_studying ? null : end_date,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      currently_studying: currently_studying || false
    };

    const { data, error } = await db
      .from('Education')
      .insert([newEducation])
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Education record successfully created.',
      data: data ? data[0] : null
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while creating education record.'
    });
  }
};

export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      course_name,
      university_name,
      uni_state,
      uni_country,
      start_date,
      end_date,
      currently_studying,
      cgpa
    } = req.body;

    const updatedEducation = {
      course_name,
      university_name,
      uni_state,
      uni_country,
      start_date,
      end_date: currently_studying ? null : end_date,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      currently_studying: currently_studying || false
    };

    const { data, error } = await db
      .from('Education')
      .update(updatedEducation)
      .eq('id', id)
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Education record successfully updated.',
      data: data ? data[0] : null
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while updating education record.'
    });
  }
};

export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await db
      .from('Education')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Education record successfully deleted.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while deleting education record.'
    });
  }
};
