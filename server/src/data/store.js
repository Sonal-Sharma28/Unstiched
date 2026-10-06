export const inputSchema = {
  "productImage": { "type": "file",     "accept": "image",  "required": true,  "order": 1, "group": "product", "label": "Product photo" },
  "backImage":    { "type": "file",     "accept": "image",  "required": false, "order": 2, "group": "product", "label": "Back of pack (optional)" },
  "productName":  { "type": "text",     "required": true,  "order": 3, "group": "product", "label": "Product name" },
  "description":  { "type": "textarea", "required": false, "order": 4, "group": "copy",    "label": "Describe the product", "maxLength": 400 },
  "tone":         { "type": "select",   "required": true,  "order": 5, "group": "copy",    "label": "Tone", "options": ["Premium", "Playful", "Clinical", "Minimal"], "allowOther": true },
  "aspectRatio":  { "type": "select",   "required": true,  "order": 6, "group": "format",  "label": "Aspect ratio", "options": ["1:1", "4:5", "9:16", "16:9"], "default": "1:1" },
  "addLogo":      { "type": "toggle",   "required": false, "order": 7, "group": "format",  "label": "Add my logo" }
};

export const templates = [
  {
    id: 'tpl_studio_packshot',
    name: 'Studio Packshot',
    description: 'Clean, professional studio lighting for e-commerce products.',
    thumbnail: 'https://picsum.photos/seed/tpl1/400/300',
    inputSchema: {
      ...inputSchema,
      tone: { ...inputSchema.tone, default: 'Minimal' }
    },
  },
  {
    id: 'tpl_lifestyle_scene',
    name: 'Lifestyle Scene',
    description: 'Contextual environment shots bringing your product to life.',
    thumbnail: 'https://picsum.photos/seed/tpl2/400/300',
    inputSchema: {
      ...inputSchema,
      tone: { ...inputSchema.tone, default: 'Playful' }
    },
  },
  {
    id: 'tpl_festive_campaign',
    name: 'Festive Campaign',
    description: 'Holiday-themed setups with rich colors and warm lighting.',
    thumbnail: 'https://picsum.photos/seed/tpl3/400/300',
    inputSchema: {
      ...inputSchema,
      tone: { ...inputSchema.tone, default: 'Premium' }
    },
  }
];

export const jobsStore = new Map();
