import { Request, Response } from 'express';
import { db } from '../config/database';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query the 'Projects' table selecting all columns (*)
    const { data, error } = await db
      .from('Projects')
      .select('*')
      .order('id', { ascending: false });

    // Handle database side errors cleanly
    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    // Standardized JSON response format
    res.status(200).json({
      success: true,
      count: data?.length || 0,
      data: data || []
    });
  } catch (err: any) {
    // Catch-all for unexpected crashes (e.g., network timeout)
    res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error encountered while fetching projects.' 
    });
  }
};