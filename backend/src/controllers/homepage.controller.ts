import { Request, Response } from 'express';
import { db } from '../config/database';
import { isValidUrl, urlValidationError } from '../middleware/validate.middleware';


export const getHomepage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await db
      .from('Homepage')
      .select('*')
      .limit(1);

    if (error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    const homepageData = data && data.length > 0 ? data[0] : {
      bio: "",
      image_url: "",
      linkedin_url: "",
      github_url: "",
      email_address: "",
      contact_no: "",
      resume_url: ""
    };

    res.status(200).json({
      success: true,
      data: homepageData
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while fetching homepage info.'
    });
  }
};

export const updateHomepage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bio, image_url, linkedin_url, github_url, email_address, contact_no, resume_url } = req.body;

    // Reject base64 data URIs — only proper https:// URLs are accepted
    if (!isValidUrl(image_url)) {
      res.status(400).json(urlValidationError('image_url'));
      return;
    }
    if (!isValidUrl(resume_url)) {
      res.status(400).json(urlValidationError('resume_url'));
      return;
    }

    const { data: existing, error: fetchError } = await db
      .from('Homepage')
      .select('id')
      .limit(1);

    if (fetchError) {
      res.status(400).json({ success: false, message: fetchError.message });
      return;
    }

    const homepageData = {
      bio: bio || "",
      image_url: image_url || "",
      linkedin_url: linkedin_url || "",
      github_url: github_url || "",
      email_address: email_address || "",
      contact_no: contact_no || "",
      resume_url: resume_url || ""
    };

    let result;
    if (existing && existing.length > 0) {
      const { data, error } = await db
        .from('Homepage')
        .update(homepageData)
        .eq('id', existing[0].id)
        .select();
      
      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      result = data ? data[0] : null;
    } else {
      const { data, error } = await db
        .from('Homepage')
        .insert([homepageData])
        .select();

      if (error) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      result = data ? data[0] : null;
    }

    res.status(200).json({
      success: true,
      message: 'Homepage updated successfully.',
      data: result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error encountered while updating homepage info.'
    });
  }
};
