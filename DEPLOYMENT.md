# Deployment Guide

## Overview
This guide covers various deployment options for the Portfolio Builder application.

## Prerequisites
- Git repository initialized
- Node.js 18+ installed locally
- npm or yarn package manager
- Build artifact ready

## Local Testing Before Deployment

```bash
# Build the project
npm run build

# Test production build locally
npm start

# Visit http://localhost:3000
```

## Deployment Options

### 1. Vercel (Recommended)

**Advantages:**
- Zero-config deployment
- Automatic deployments on git push
- Built-in environment variables
- Edge Functions support
- Free tier available

**Steps:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production
vercel --prod
```

Or connect GitHub:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click Deploy

### 2. Netlify

**Advantages:**
- Easy GitHub integration
- Continuous deployment
- Environment variables UI
- Generous free tier

**Steps:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Or use Web UI:
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `.next`

### 3. AWS Amplify

**Advantages:**
- AWS integration
- Scalable infrastructure
- Lambda support
- Custom domains

**Steps:**

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```

### 4. GitHub Pages (Static Export)

The repository includes a GitHub Actions workflow that builds and deploys the static export whenever changes are pushed to `main`.

Before the first deployment, open the repository's **Settings → Pages** and set **Source** to **GitHub Actions**.

Then push to `main` or run **Deploy to GitHub Pages** manually from the **Actions** tab. The project site will be available at:

`https://satish-970.github.io/Netflix_resume/`

### 5. Docker

**Create `Dockerfile`:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t portfolio-builder .
docker run -p 3000:3000 portfolio-builder
```

### 6. Traditional VPS (Ubuntu/Debian)

**Setup:**

```bash
# SSH into server
ssh user@your-server.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository
git clone your-repo-url
cd portfolio-builder

# Install dependencies
npm install

# Build
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start "npm start" --name "portfolio-builder"
pm2 startup
pm2 save
```

**Setup Nginx reverse proxy:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Create `.env.production` for production settings:

```env
NEXT_PUBLIC_APP_NAME=Portfolio Builder
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NODE_ENV=production
```

## SSL/TLS Certificate

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
sudo certbot renew --dry-run
```

### Automatic Renewal

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Custom Domain Setup

### Vercel
1. Add domain in project settings
2. Update DNS records (shown in Vercel dashboard)

### Netlify
1. Domain settings → Add custom domain
2. Follow DNS setup instructions

### AWS Route 53
1. Create hosted zone
2. Update nameservers at registrar
3. Create A record pointing to CloudFront

## Monitoring & Analytics

### Option 1: Vercel Analytics
- Built-in Web Vitals
- Real user metrics
- Performance insights

### Option 2: Google Analytics
```html
<!-- Add to layout.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Option 3: Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

## Performance Optimization

### Image Optimization
- Use Next.js `<Image>` component
- Enable automatic optimization

### CSS/JS Minification
- Automatically done in production
- Configure in `next.config.js` if needed

### Caching Strategy
```javascript
// next.config.js
const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
}
```

## Database Setup (if needed in future)

### PostgreSQL
```bash
# Using Docker
docker run -e POSTGRES_PASSWORD=password \
  -d -p 5432:5432 postgres:15
```

### MongoDB
```bash
# Using MongoDB Atlas (Cloud)
# Connection string in .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

## Backup Strategy

### Git Backups
```bash
git push origin main
git push --all
git push --tags
```

### Database Backups
```bash
# PostgreSQL
pg_dump dbname > backup.sql

# MongoDB
mongodump --uri "mongodb://..."
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
npm run build -- --clean-dist

# Check Node version
node --version  # Should be 18+

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Deploy Hangs
- Check internet connection
- Verify API credentials
- Check logs for errors
- Try deployment again

### Performance Issues
- Analyze bundle size: `npm run build -- --analyze`
- Check Core Web Vitals
- Enable caching
- Use CDN

## Security Checklist

- [ ] Environment variables not exposed
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] Dependencies updated
- [ ] No console.log in production
- [ ] API rate limiting
- [ ] Regular backups

## Rollback Procedure

### Vercel
```bash
vercel rollback
```

### Other Platforms
```bash
# Revert to previous commit
git revert HEAD
git push

# Redeploy
npm run build
npm start
```

## Support & Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Deploy](https://docs.netlify.com)
- [AWS Amplify](https://docs.amplify.aws)

---

**Choose the deployment option that best fits your needs!**
