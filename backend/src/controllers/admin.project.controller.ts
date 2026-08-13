import { Request, Response } from 'express';
import { db } from '../config/database';
import { isValidUrl, isValidUrlArray, urlValidationError } from '../middleware/validate.middleware';


export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      project_title,
      project_description,
      project_tech_stacks,
      project_live_link,
      project_github_link,
      project_pic_url
    } = req.body;

    if (!project_title || !project_description) {
      res.status(400).json({
        success: false,
        message: 'Validation Error: Project title and description are required.'
      });
      return;
    }

    if (!isValidUrlArray(project_pic_url)) {
      res.status(400).json(urlValidationError('project_pic_url'));
      return;
    }
    if (!isValidUrl(project_live_link)) {
      res.status(400).json(urlValidationError('project_live_link'));
      return;
    }
    if (!isValidUrl(project_github_link)) {
      res.status(400).json(urlValidationError('project_github_link'));
      return;
    }

    const newProject = {
      project_title,
      project_description,
      project_tech_stacks: project_tech_stacks || [],
      project_live_link: project_live_link || null,
      project_github_link: project_github_link || null,
      project_pic_url: project_pic_url || []
    };

    const { data, error } = await db
      .from('Projects')
      .insert([newProject])
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Project successfully created.',
      data: data ? data[0] : null
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while creating project.'
    });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      project_title,
      project_description,
      project_tech_stacks,
      project_live_link,
      project_github_link,
      project_pic_url
    } = req.body;

    const updatedProject = {
      project_title,
      project_description,
      project_tech_stacks: project_tech_stacks || [],
      project_live_link: project_live_link || null,
      project_github_link: project_github_link || null,
      project_pic_url: project_pic_url || []
    };

    if (!isValidUrlArray(project_pic_url)) {
      res.status(400).json(urlValidationError('project_pic_url'));
      return;
    }
    if (!isValidUrl(project_live_link)) {
      res.status(400).json(urlValidationError('project_live_link'));
      return;
    }
    if (!isValidUrl(project_github_link)) {
      res.status(400).json(urlValidationError('project_github_link'));
      return;
    }

    const { data, error } = await db
      .from('Projects')
      .update(updatedProject)
      .eq('id', id)
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project successfully updated.',
      data: data ? data[0] : null
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while updating project.'
    });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await db
      .from('Projects')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project successfully deleted.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while deleting project.'
    });
  }
};