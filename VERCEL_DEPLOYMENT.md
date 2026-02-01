# Vercel Deployment Instructions

## Environment Variables Required in Vercel Dashboard:
- VITE_API_BASE_URL=https://your-backend-url.railway.app
- VITE_APP_NAME=Cranberry Marketplace  
- VITE_NODE_ENV=production

## Build Settings in Vercel:
- Build Command: npm run build
- Output Directory: Cranberry-Frontend/dist
- Install Command: npm install
- Root Directory: ./

## Notes:
- Update backend URL in vercel.json after backend deployment
- Frontend will be served as SPA with client-side routing
- API calls will be proxied to backend during development