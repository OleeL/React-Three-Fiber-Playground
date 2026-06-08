const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH || '';

export const publicAssetPath = (path: string) =>
	`${basePath}${path.startsWith('/') ? path : `/${path}`}`;
