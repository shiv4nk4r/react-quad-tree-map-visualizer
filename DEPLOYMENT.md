# GitHub Pages Deployment Guide

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

## Setup Instructions

### 1. Enable GitHub Pages in Repository Settings

1. Go to your GitHub repository: `https://github.com/shiv4nk4r/react-quad-tree-map-visualizer`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 2. Automatic Deployment

The deployment will happen automatically when you:
- Push changes to the `build` branch
- The GitHub Actions workflow will build and deploy your app

### 3. Manual Deployment (Alternative)

If you prefer manual deployment, you can also use:

```bash
# Install dependencies
yarn install

# Build and deploy manually
yarn deploy
```

This will build the project and push it to the `gh-pages` branch.

## Deployment Details

- **Live URL**: Your app will be available at: `https://shiv4nk4r.github.io/react-quad-tree-map-visualizer/`
- **Source Branch**: `build` (current branch)
- **Deployment Method**: GitHub Actions
- **Build Tool**: Vite
- **Deploy Tool**: GitHub Pages

## Files Modified for Deployment

- `vite.config.js` - Added base path configuration
- `package.json` - Added deploy script and gh-pages dependency
- `.github/workflows/deploy.yml` - GitHub Actions workflow for automatic deployment

## Troubleshooting

If the deployment fails:
1. Check the **Actions** tab in your GitHub repository for error details
2. Ensure the repository has Pages enabled in Settings
3. Verify that the `build` branch has the latest changes
4. Check that all dependencies are properly installed

## Viewing Deployment Status

You can monitor deployment progress in:
- GitHub repository → **Actions** tab
- GitHub repository → **Settings** → **Pages** (shows deployment status)