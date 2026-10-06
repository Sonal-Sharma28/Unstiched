import * as templatesService from '../services/templatesService.js';

export function getTemplates(req, res, next) {
  try {
    const templates = templatesService.getAllTemplates();
    res.json(templates);
  } catch (err) {
    next(err);
  }
}
