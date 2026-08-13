import { Request, Response } from 'express';
import { db } from '../config/database';
import { isValidUrl, urlValidationError } from '../middleware/validate.middleware';


export const getCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await db
      .from('Certificates')
      .select('*')
      .order('date_received', { ascending: false });

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
    res.status(500).json({ success: false, message: 'Internal Server Error fetching certificates.' });
  }
};

export const createCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      certificate_name,
      certificate_bodies,
      certificate_img_url,
      date_received,
      credential_id
    } = req.body;

    if (!certificate_name || !certificate_bodies || !date_received || !credential_id) {
      res.status(400).json({
        success: false,
        message: 'Validation Error: Name, bodies, date, and credential ID are required.'
      });
      return;
    }

    if (!isValidUrl(certificate_img_url)) {
      res.status(400).json(urlValidationError('certificate_img_url'));
      return;
    }

    const newCertificate = {
      certificate_name,
      certificate_bodies,
      certificate_img_url: certificate_img_url || null,
      date_received,
      credential_id
    };

    const { data, error } = await db
      .from('Certificates')
      .insert([newCertificate])
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Certificate successfully registered.',
      data: data ? data[0] : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error creating certificate.' });
  }
};

export const updateCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      certificate_name,
      certificate_bodies,
      certificate_img_url,
      date_received,
      credential_id
    } = req.body;

    const updatedCertificate = {
      certificate_name,
      certificate_bodies,
      certificate_img_url: certificate_img_url || null,
      date_received,
      credential_id
    };

    if (!isValidUrl(certificate_img_url)) {
      res.status(400).json(urlValidationError('certificate_img_url'));
      return;
    }

    const { data, error } = await db
      .from('Certificates')
      .update(updatedCertificate)
      .eq('id', id)
      .select();

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Certificate successfully updated.',
      data: data ? data[0] : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error updating certificate.' });
  }
};

export const deleteCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await db
      .from('Certificates')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Certificate successfully deleted.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error deleting certificate.' });
  }
};
