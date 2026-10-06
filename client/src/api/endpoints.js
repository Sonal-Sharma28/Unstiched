const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const API_ROOT = `${API_BASE_URL.replace(/\/+$/, '').replace(/\/api$/i, '')}/api`;

export const getTemplates = async (options) => {
  const res = await fetch(`${API_ROOT}/templates`, options);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
};

export const getTemplateSchema = async (id, options) => {
  const res = await fetch(`${API_ROOT}/templates/${id}/schema`, options);
  if (!res.ok) throw new Error('Failed to fetch schema');
  return res.json();
};

export const createJob = async (templateId, formData, options) => {
  const res = await fetch(`${API_ROOT}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId, inputs: formData }),
    ...options
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create job');
  }
  return res.json();
};

export const getJobStatus = async (id, options) => {
  const res = await fetch(`${API_ROOT}/jobs/${id}`, options);
  if (!res.ok) {
    const err = new Error('Failed to fetch job status');
    err.status = res.status;
    throw err;
  }
  return res.json();
};

export const setLike = async (jobId, outputId, liked, options) => {
  const res = await fetch(`${API_ROOT}/jobs/${jobId}/outputs/${outputId}/like`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liked }),
    ...options
  });
  if (!res.ok) throw new Error('Failed to set like');
  return res.json();
};
