import { templates } from '../data/store.js';

export function getAllTemplates() {
  return templates;
}

export function getTemplateById(id) {
  return templates.find(t => t.id === id);
}
