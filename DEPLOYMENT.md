# GitHub Pages Deployment Guide

This guide explains how to deploy your Personal Finance application to GitHub Pages.

## What I've Fixed

1. **Vite Configuration**: Updated `vite.config.js` with the correct base path for GitHub Pages
2. **GitHub Actions**: Created automated deployment workflow
3. **Jekyll Bypass**: Added `.nojekyll` file to prevent Jekyll processing
4. **Client-side Routing**: Added `404.html` for proper React Router support
5. **Build Process**: Verified the build works correctly

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages in your repository**:
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy your site

3. **Wait for deployment**:
   - Go to the "Actions" tab in your repository
   - You should see a workflow running called "Deploy to GitHub Pages"
   - Wait for it to complete (usually takes 2-3 minutes)

4. **Access your site**:
   - Your site will be available at: `https://ndt2000.github.io/Personal-Finance/`

### Option 2: Manual Deployment

If you prefer manual deployment:

1. **Install gh-pages** (already added to package.json):
   ```bash
   npm install
   ```

2. **Deploy manually**:
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Select "/ (root)" folder

## Important Notes

- **Base Path**: The app is configured for `/Personal-Finance/` path
- **Client-side Routing**: The `404.html` file handles React Router navigation
- **No Jekyll**: The `.nojekyll` file prevents GitHub from processing your files with Jekyll
- **Automatic Updates**: Every push to main branch will trigger a new deployment

## Troubleshooting

### If the site shows a blank page:
1. Check browser console for errors
2. Verify the base path in `vite.config.js` matches your repository name
3. Ensure all assets are loading correctly

### If routing doesn't work:
1. The `404.html` file should handle client-side routing
2. Make sure it's in the root of your repository

### If build fails:
1. Check the Actions tab for error details
2. Run `npm run build` locally to test
3. Ensure all dependencies are installed

## File Structure After Deployment

```
Personal-Finance/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── .nojekyll                    # Prevents Jekyll processing
├── public/404.html              # Handles client-side routing
├── vite.config.js               # Updated with base path
└── dist/                        # Built files (auto-generated)
```

Your application should now be accessible at: https://ndt2000.github.io/Personal-Finance/
