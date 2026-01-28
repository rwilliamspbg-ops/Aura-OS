# GitHub Actions Workflow Documentation

## Test and Deploy Workflow

This document describes the `test-and-deploy.yml` workflow that automates testing, building, and deploying the Aura-OS application.

### Overview

The workflow consists of three main jobs that execute sequentially:
1. **Test** - Validates code quality and functionality
2. **Build and Push Docker** - Creates and pushes Docker images
3. **Deploy** - Deploys the application using Docker Compose

### Trigger Events

The workflow is triggered on:
- **Push events** to the `main` branch
- **Pull requests** to the `main` branch

### Jobs

#### 1. Test Job
**Runs on:** Ubuntu Latest  
**Matrix Strategy:** Tests against Node.js versions 18.x and 20.x

**Steps:**
- Checkout repository code
- Set up Node.js environment with npm caching
- Install dependencies using `npm ci`
- Run linter (`npm run lint`)
- Build project (`npm run build`)
- Run tests (`npm test --if-present`)

**Purpose:** Ensures code quality and catches breaking changes before deployment.

#### 2. Build and Push Docker Job
**Runs on:** Ubuntu Latest  
**Dependencies:** Requires successful completion of `test` job  
**Triggers:** Only on `push` events to `main` branch

**Permissions:**
- `contents: read` - Read repository contents
- `packages: write` - Write to GitHub Container Registry

**Steps:**
- Checkout repository code
- Set up Docker Buildx for advanced build capabilities
- Authenticate with GitHub Container Registry (ghcr.io)
- Build and push backend Docker image
  - Tags: `latest` and commit SHA
  - Registry: `ghcr.io`
  - Caching enabled for faster builds
- Build and push frontend Docker image
  - Tags: `latest` and commit SHA
  - Registry: `ghcr.io`
  - Caching enabled for faster builds

**Purpose:** Creates containerized versions of backend and frontend for deployment.

#### 3. Deploy Job
**Runs on:** Ubuntu Latest  
**Dependencies:** Requires successful completion of `build-and-push-docker` job  
**Triggers:** Only on `push` events to `main` branch

**Environment Variables:**
- `GITHUB_TOKEN` - GitHub authentication token for pulling private images

**Steps:**
- Checkout repository code
- Pull latest Docker images
- Start containers using Docker Compose
- Verify deployment
  - Wait 10 seconds for services to start
  - Check backend health endpoint (port 3001)
  - Check frontend availability (port 3000)

**Purpose:** Automatically deploys the application to production.

### Ports

- **Backend:** Port 3001 (includes health check endpoint)
- **Frontend:** Port 3000

### Environment Setup

The workflow requires:
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- Docker installed on the runner (provided by `ubuntu-latest`)
- Valid `docker-compose.yml` in repository root

### Caching

- **npm dependencies:** Cached per Node.js version to speed up installs
- **Docker layers:** Registry-based caching for faster image builds

### Failure Handling

- Workflow stops if any step fails
- Deploy job is skipped if build fails
- Pull requests don't trigger deploy (only push to main)
- Health checks must pass for deployment to succeed

### Security

- Uses GitHub Container Registry for private image storage
- Authenticates with `GITHUB_TOKEN` for registry access
- Minimal permissions assigned (read + write for packages)
- No sensitive credentials stored in workflow file

### Customization

To modify the workflow:

1. **Change Node.js versions:**
   ```yaml
   strategy:
     matrix:
       node-version: [18.x, 20.x, 21.x]
   ```

2. **Add environment variables:**
   ```yaml
   env:
     NODE_ENV: production
   ```

3. **Modify build directories:**
   - Change `context: ./backend` or `./frontend` paths

4. **Adjust health check timeouts:**
   ```yaml
   sleep 20  # Increase wait time
   ```

### Troubleshooting

**Workflow fails on lint step:**
- Fix linting errors: `npm run lint -- --fix`

**Docker build fails:**
- Ensure Dockerfile exists in backend/ and frontend/ directories
- Check that all dependencies are listed in package.json

**Deployment health check fails:**
- Verify services are starting correctly
- Check docker-compose.yml port mappings
- Ensure health endpoint is available at `/health`

**Registry authentication fails:**
- Verify GITHUB_TOKEN permissions in repository settings
- Ensure GitHub Container Registry is enabled for the organization

### Monitoring

View workflow runs in:
- GitHub repository > Actions tab
- Click on specific run to see detailed logs
- Check individual step outputs for debugging

### References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build and Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
