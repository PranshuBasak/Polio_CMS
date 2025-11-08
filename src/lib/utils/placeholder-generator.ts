/**
 * Placeholder Image Generator
 * Generates beautiful gradient placeholder images for avatars, profiles, and thumbnails
 */

export const generateGradientPlaceholder = (
  width: number,
  height: number,
  seed = 'default'
): string => {
  // Generate colors based on seed for consistency
  const hash = seed.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const color1 = `hsl(${(hash % 360) + 200}, 70%, 60%)`;
  const color2 = `hsl(${((hash + 60) % 360) + 200}, 75%, 65%)`;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad${seed})"/>
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 4}"
              fill="white" fill-opacity="0.2"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

export const generateTechLogoPlaceholder = (
  size: number,
  techName: string
): string => {
  const hash = techName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const hue = (hash % 360) + 180;
  const color = `hsl(${hue}, 65%, 55%)`;
  const initials = techName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="techgrad${techName}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(${hue + 30}, 70%, 60%);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size / 8}" fill="url(#techgrad${techName})"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size / 2.5}"
            font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

export const generateProjectThumbnail = (
  width: number,
  height: number,
  projectName: string
): string => {
  const hash = projectName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const hue = hash % 360;
  const color1 = `hsl(${hue}, 60%, 50%)`;
  const color2 = `hsl(${(hue + 60) % 360}, 65%, 55%)`;
  const color3 = `hsl(${(hue + 120) % 360}, 70%, 60%)`;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="projgrad${projectName}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#projgrad${projectName})"/>
      <rect x="${width * 0.15}" y="${height * 0.15}" width="${width * 0.7}" height="${height * 0.7}"
            rx="${Math.min(width, height) / 16}" fill="white" fill-opacity="0.15"/>
      <circle cx="${width * 0.3}" cy="${height * 0.3}" r="${Math.min(width, height) / 12}"
              fill="white" fill-opacity="0.2"/>
      <circle cx="${width * 0.7}" cy="${height * 0.7}" r="${Math.min(width, height) / 16}"
              fill="white" fill-opacity="0.2"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Default placeholders
export const DEFAULT_AVATAR_PLACEHOLDER = generateGradientPlaceholder(
  400,
  400,
  'avatar'
);
export const DEFAULT_TECH_PLACEHOLDER = (name: string) =>
  generateTechLogoPlaceholder(60, name);
export const DEFAULT_PROJECT_PLACEHOLDER = (name: string) =>
  generateProjectThumbnail(500, 300, name);
