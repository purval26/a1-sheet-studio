// Sheet & layout constants for A1 Paper (Landscape: 841mm x 594mm)

export const SHEET_CONFIG = {
  // A1 Landscape standard physical dimensions in millimeters
  WIDTH_MM: 841,
  HEIGHT_MM: 594,
  PT_PER_MM: 72 / 25.4, // ~2.83464567 PDF points per millimeter

  // Default Margins
  DEFAULT_MARGIN_LEFT_MM: 20, // 2 cm binding margin
  DEFAULT_MARGIN_TOP_MM: 10,  // 1 cm
  DEFAULT_MARGIN_RIGHT_MM: 10, // 1 cm
  DEFAULT_MARGIN_BOTTOM_MM: 10, // 1 cm

  // Borders & Bottom Title Block
  DEFAULT_BORDER_WIDTH_MM: 1.5,
  DEFAULT_TITLE_BLOCK_HEIGHT_MM: 50, // 5 cm height
  DEFAULT_SPLIT_RATIO_PERCENT: 72, // 72% left for title, 28% right for details

  // Spacings for collage
  DEFAULT_PHOTO_GAP_MM: 10,
  DEFAULT_PHOTO_PADDING_MM: 10,
};

export const AVAILABLE_FONTS = [
  { id: 'Times-Roman', name: 'Times New Roman (Serif)', css: 'font-serif' },
  { id: 'Helvetica', name: 'Helvetica / Inter (Sans-Serif)', css: 'font-sans' },
  { id: 'Courier', name: 'Courier New (Monospace)', css: 'font-mono' },
];

export const MOSAIC_TEMPLATES = [
  { id: 'hero-left', name: 'Hero Left (1 Big + Stacked Right)', minPhotos: 2 },
  { id: 'hero-right', name: 'Hero Right (Stacked Left + 1 Big)', minPhotos: 2 },
  { id: 'hero-top', name: 'Hero Top (Panoramic + Bottom Row)', minPhotos: 2 },
  { id: 'asymmetric-4', name: 'Asymmetric Quad (1 Large + 3 Surrounding)', minPhotos: 3 },
  { id: 'asymmetric-5', name: 'Asymmetric 5 (1 Hero + 4 Equal Sub-cells)', minPhotos: 4 },
];

// Clean initial state with NO default values, NO hardcoded images, theme support
export const DEFAULT_STATE = {
  // Page & Theme
  activeView: 'landing', // 'landing' or 'studio'
  mobileViewTab: 'preview', // 'preview' or 'controls' on mobile
  theme: 'dark', // 'dark' or 'light'

  // Layout settings
  marginLeft: 20,
  marginTop: 10,
  marginRight: 10,
  marginBottom: 10,
  borderWidth: 1.5,
  titleBlockHeight: 50,
  splitRatio: 72,

  // Typography - Clean blank initial values
  sheetTitle: '',
  titleFont: 'Times-Roman',
  titleFontSize: 28, // in points
  titleBold: false,
  titleItalic: false,

  // Dynamic details - Starts empty
  details: [],
  detailsFont: 'Times-Roman',
  detailsFontSize: 11, // in points

  // Photo Collage & Mosaic settings
  layoutType: 'grid', // 'grid' or 'mosaic'
  mosaicTemplate: 'hero-left', // 'hero-left', 'hero-right', 'hero-top', 'asymmetric-4', 'asymmetric-5'
  gridMode: 'manual', // 'auto' or 'manual'
  gridRows: 2,
  gridCols: 3,
  photoGap: 10, // mm
  photoPadding: 10, // mm
  fitMode: 'cover', // 'cover' or 'contain'

  // Photos list - Starts empty
  photos: [],

  // UI / Preview state
  zoomLevel: 1, // 1 = auto-fit
  showGridGuides: false,
  isExportingPdf: false,
};

// Helpful starter templates for students/architects
export const DETAIL_PRESETS = [
  { label: 'Name', placeholder: 'Your Full Name' },
  { label: 'Year', placeholder: 'e.g. 1st Year B.Arch' },
  { label: 'Subject', placeholder: 'e.g. Architectural Design Studio' },
  { label: 'Roll No', placeholder: 'e.g. 2026-ARCH-042' },
  { label: 'Institute', placeholder: 'Faculty of Architecture / University', isStandalone: true },
];

// Centralized Creator Acknowledgement Configuration
export const CREATOR_CREDITS = {
  storageKey: 'a1_creator_intro_completed_v1',
  tanish: {
    name: 'Tanish',
    role: 'Originator of the original problem and idea',
    instagram: 'https://instagram.com/mr.gajera1010',
    handle: '@mr.gajera1010',
  },
  purval: {
    name: 'Purval',
    role: 'Developer who solved the problem and built the tool',
    instagram: 'https://instagram.com/rntxpurval',
    handle: '@rntxpurval',
  },
  attributionText: 'An idea by Tanish · Built by Purval',
  scenes: [
    { id: 1, text: 'Every useful tool starts with a problem.', highlight: 'problem', duration: 1800 },
    { id: 2, text: 'An idea sparked by Tanish.', highlight: 'Tanish', name: 'Tanish', duration: 1700 },
    { id: 3, text: 'A solution built by Purval.', highlight: 'Purval', name: 'Purval', duration: 1700 },
    { id: 4, text: 'One problem. One solution. One useful tool.', highlight: 'One useful tool.', duration: 1900 },
  ],
};
