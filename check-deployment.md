# GitHub Pages Deployment Troubleshooting

## Current Status Check

### 1. **Check GitHub Actions**
- Go to your repository: https://github.com/NDT2000/Personal-Finance
- Click on the "Actions" tab
- Look for the "Deploy to GitHub Pages" workflow
- Check if it's running or completed successfully

### 2. **Check GitHub Pages Settings**
- Go to repository Settings → Pages
- Under "Source", it should show either:
  - "Deploy from a branch" → gh-pages branch
  - "GitHub Actions" (if using the workflow)

### 3. **Verify gh-pages Branch**
- Go to your repository main page
- Click on the branch dropdown (should show "main")
- Look for "gh-pages" branch in the list
- If it exists, click on it to see the deployed files

### 4. **Test URLs**
Try these URLs in order:
1. `https://ndt2000.github.io/Personal-Finance/` (main URL)
2. `https://ndt2000.github.io/Personal-Finance/index.html` (direct file)
3. Check if the gh-pages branch exists: `https://github.com/NDT2000/Personal-Finance/tree/gh-pages`

## Common Issues & Solutions

### Issue 1: "404 Not Found"
**Cause**: GitHub Pages not enabled or deployment failed
**Solution**: 
- Enable GitHub Pages in Settings → Pages
- Select "Deploy from a branch" → gh-pages branch
- Or select "GitHub Actions" if using the workflow

### Issue 2: "Blank Page"
**Cause**: JavaScript/CSS not loading due to base path issues
**Solution**: 
- Check browser console for 404 errors on assets
- Verify vite.config.js has correct base path

### Issue 3: "Actions Workflow Failed"
**Cause**: Permission or build issues
**Solution**:
- Check Actions logs for specific errors
- Ensure repository has proper permissions
- Try manual deployment with `npm run deploy`

## Manual Deployment (If Needed)

If the automatic deployment isn't working, you can deploy manually:

```bash
# Install gh-pages if not already installed
npm install

# Deploy manually
npm run deploy
```

This will create the gh-pages branch and deploy your site.

## Expected File Structure on gh-pages Branch

```
gh-pages/
├── index.html
├── 404.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── .nojekyll
```

## Next Steps

1. Check the GitHub Actions status
2. Verify GitHub Pages is enabled
3. Wait 5-10 minutes for deployment to complete
4. Try accessing the site again

If still having issues, check the browser console for specific error messages.
