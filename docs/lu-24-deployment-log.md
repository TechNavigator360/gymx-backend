# LU24 Deployment Log – GYMX Backend

## 1. Pre-deployment baseline

Date:
Branch:
Commit hash:

### Application
- Runtime: Node.js
- Framework: Express.js
- ORM: Prisma
- Database: SQL Server
- API style: REST / JSON
- Authentication: JWT

### Pre-deployment checks
| Check | Command / evidence | Result |
|---|---|---|
| Git status clean | `git status` | |
| Current branch checked | `git branch --show-current` | |
| Latest commit recorded | `git log -1 --oneline` | |
| Dependencies installed | `npm install` | |
| App starts locally | `npm run dev` | |
| Health endpoint works | `GET /health` | |
| Prisma client generated | `npx prisma generate` | |
| Database migration status checked | `npx prisma migrate status` | |
| Integration tests pass | Postman Collection Runner | |
| Security checks pass | Postman/Burp evidence | |
| Environment variables identified | `.env.example` / deployment settings | |
| Secrets not committed | `.gitignore` + repository check | |

Attempting to start the SQL Server container failed because the Docker daemon was not running. This means the local database dependency was unavailable before deployment checks.

Evidence:
`docker start gymx-sql` returned an error indicating Docker Desktop Linux Engine was not available.

Resolution:
Docker Desktop must be started before running database-dependent checks.

### Known post-deployment checks
- HTTPS enabled
- Production environment variables configured
- Database credentials secured
- CORS checked
- Logging/monitoring checked
- Deployed health endpoint checked
- Rollback option documented

Resolution result:
Docker Desktop was started successfully. The SQL Server container `gymx-sql` is running and exposes port 1433.

Evidence:
`docker ps` shows `gymx-sql` with status `Up` and port mapping `0.0.0.0:1433->1433/tcp`.

Command:
`node src/server.js`

Verification:
Endpoints tested manually via Postman:
- `GET /health`
- authenticated endpoints
- database-connected endpoints

Result:
The backend also starts correctly without nodemon using the direct Node.js runtime command. API requests and database communication function correctly in this mode.

Impact:
This confirms the application can run in a production-style environment without relying on development tooling.

### Deployment platform decision

The deployment target for GYMX is Microsoft Azure.

Chosen services:
- Azure App Service for hosting the Node.js/Express backend API
- Azure SQL Database for managed SQL Server-compatible database hosting
- GitHub Actions for CI/CD deployment from the GitHub repository
- Azure App Service environment variables for runtime configuration and secrets

Rationale:
Azure was selected because it supports both the backend runtime and the SQL Server database within one cloud platform. This avoids changing the existing architecture and keeps the deployment aligned with the LU22/LU23 technical design. Azure App Service supports Node.js applications and GitHub Actions-based deployment, while Azure SQL Database provides managed database hosting. Configuration values such as DATABASE_URL and JWT_SECRET will be configured through Azure environment variables instead of a committed .env file.

## Deployment strategy

For GYMX, a Big Bang deployment strategy is used. Each new validated backend version fully replaces the previous running version during deployment.

This strategy was intentionally selected because GYMX is a relatively small backend-only MVP without high availability requirements, distributed infrastructure or large-scale production traffic. More advanced deployment strategies such as rolling, canary or blue-green deployment would introduce unnecessary operational complexity for the scope of the application.

The adapted deployment flow for GYMX is:

1. Development takes place on a feature or refactor branch.
2. Functionality is validated locally using Postman, Prisma and Docker.
3. Changes are merged into the stable `master` branch.
4. GitHub Actions executes the CI/CD pipeline.
5. A new backend version is deployed to Azure App Service.
6. The deployed API is verified using `/health` and authenticated endpoint checks.

Rollback remains possible by reverting a faulty commit and redeploying the previously validated version through the same deployment pipeline.

## Git version management strategy

GYMX uses Git as distributed version control and GitHub as remote repository platform. The applied workflow is based on the Git/GitHub training provided during the Backend Development module, where the main branch should remain stable and deployable at all times. :contentReference[oaicite:1]{index=1}

Applied workflow:
- `master` functions as the stable deployment branch.
- New functionality and refactors are developed on separate branches.
- Pull Requests are used before merging into `master`.
- The school repository is used for assessment and review evidence.
- The personal repository functions as a portfolio mirror.

Configured remotes:
- `school`
- `personal`

This workflow improves traceability, supports code review, reduces the risk of unstable deployments and keeps the deployable branch aligned with the CI/CD process.

## Continuous testing approach

Testing is performed continuously during development instead of only at the end of the project. As functionality was implemented, API flows were immediately validated through Postman and later expanded into larger integration test collections.

The testing process includes:
- authentication flows
- JWT validation
- ownership authorization
- CRUD operations
- progress calculation
- invalid input validation
- protected endpoint verification
- security-related error handling

This incremental testing approach reduced the risk of unstable deployments because backend behavior, database communication and authentication flows were already validated before deployment preparation started.

## Planned post-deployment validation

After deployment, additional validation will be performed against the live Azure environment.

Planned checks include:
- verifying HTTPS functionality
- verifying production environment variable configuration
- validating JWT authentication on deployed endpoints
- verifying that users cannot access each other’s data
- lightweight concurrent multi-user load testing
- verifying safe production error responses
- checking CORS behavior
- validating cloud configuration and runtime logging

These checks are performed after deployment because they depend on the actual production hosting environment and cannot be fully validated locally.

## Post-deployment security checklist

| Control point | Status | Notes |
|---|---|---|
| HTTPS enabled | Nog uitvoeren | Verify Azure HTTPS endpoint |
| Environment variables correctly configured | Nog uitvoeren | Verify Azure App Service settings |
| JWT secret not hardcoded | Gereed | Uses environment variables and `.env` exclusion |
| Database credentials securely stored | Nog uitvoeren | Configure Azure connection settings |
| Production `.env` not publicly accessible | Nog uitvoeren | Verify deployment excludes local secrets |
| Protected endpoints require JWT authentication | Gereed | Verified with Postman integration tests |
| CORS configuration checked | Nog uitvoeren | Verify deployed origin behavior |
| API error messages contain no sensitive information | Gereed | Verified during Postman and Burp testing |
| Cloud deployment configuration checked | Nog uitvoeren | Verify Azure runtime configuration |
| Logging and monitoring checked | Nog uitvoeren | Verify Azure log stream and monitoring |

## LU24 Deployment Execution Checklist

### Phase 0 — Start deployment branch
- [x] Confirm local baseline is complete
- [x] Check current branch: `git branch --show-current`
- [x] Check clean status: `git status`
- [x] Create deployment branch:
      `git checkout -b feature/lu24-deployment`
- [x] Commit deployment log so far:
      `git add docs/lu24-deployment-log.md`
      `git commit -m "docs(lu24): add deployment preparation log"`

### Phase 1 — Production readiness
- [x] Verify `server.js` uses `process.env.PORT || 3000`
- [x] Verify `.env` is ignored
- [x] Create `.env.example` without secrets
- [x] Check `package.json` scripts:
      `start`, `dev`, possibly `test`
- [x] Run local startup:
      `node src/server.js`
- [x] Test in Postman:
      `/health`, login, protected endpoint
- [x] Commit:
      `git add .`
      `git commit -m "chore(deploy): prepare production runtime configuration"`

### Phase 1a — Containerization

- [ ] Create Dockerfile
- [ ] Build backend container image
- [ ] Run backend container locally
- [ ] Verify `/health` endpoint from container
- [ ] Verify container can connect to SQL Server
- [ ] Document evidence
- [ ] Commit containerization setup

### Phase 2 — Azure database
- [ ] Create Azure SQL Database
- [ ] Configure firewall/network access
- [ ] Add production `DATABASE_URL`
- [ ] Run production migration:
      `npx prisma migrate deploy`
- [ ] Verify schema exists
- [ ] Document evidence in deployment log
- [ ] Commit documentation update:
      `git add docs/lu24-deployment-log.md`
      `git commit -m "docs(lu24): document Azure SQL setup"`

### Phase 3 — Azure App Service
- [ ] Create Azure App Service for Node.js
- [ ] Configure App Settings:
      `DATABASE_URL`
      `JWT_SECRET`
      `PORT`
- [ ] Configure startup command:
      `npm start`
- [ ] Deploy manually first or via GitHub Actions
- [ ] Test live:
      `/health`
- [ ] Test live protected endpoint in Postman
- [ ] Document evidence
- [ ] Commit documentation:
      `git add docs/lu24-deployment-log.md`
      `git commit -m "docs(lu24): document initial Azure deployment"`

### Phase 4 — CI/CD pipeline
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Pipeline steps:
      checkout
      setup Node
      `npm ci`
      `npx prisma validate`
      deploy to Azure
- [ ] Add GitHub/Azure deployment secret or publish profile
- [ ] Push branch
- [ ] Open PR
- [ ] Verify pipeline runs
- [ ] Merge into `master`
- [ ] Confirm deployment from `master`
- [ ] Commit:
      `git add .github/workflows/deploy.yml docs/lu24-deployment-log.md`
      `git commit -m "ci(lu24): add Azure deployment pipeline"`

### Phase 5 — Post-deployment validation
- [ ] HTTPS works
- [ ] Environment variables work
- [ ] `.env` not deployed or exposed
- [ ] JWT protected endpoints still require token
- [ ] User B cannot access User A data
- [ ] Error messages are safe
- [ ] CORS checked
- [ ] Azure logs checked
- [ ] Run lightweight multi-user/load test
- [ ] Document results
- [ ] Commit:
      `git add docs/lu24-deployment-log.md`
      `git commit -m "docs(lu24): add post-deployment validation results"`

### Phase 6 — Finish
- [ ] Final `git status`
- [ ] Push branch to school:
      `git push -u school feature/lu24-deployment`
- [ ] Create PR into `master`
- [ ] Merge after checks pass
- [ ] Pull updated master:
      `git checkout master`
      `git pull school master`
- [ ] Push stable master to personal:
      `git push personal master`

## Deployment preparation log

### Step 01 — Verify repository status

Commands:
`git status`
`git branch --show-current`
`git log -1 --oneline`

Result:
- Current branch: `master`
- Working tree initially contained untracked `docs/`
- Latest validated commit:
  `19c995d refactor(errors): apply code review feedback`

Impact:
The repository state was verified before deployment preparation started.

### Step 02 — Verify local runtime environment

Commands:
`node -v`
`npm -v`

Result:
- Node.js: `v24.13.1`
- npm: `11.8.0`

Impact:
The local runtime environment was verified before deployment-related changes.
### Step 03 — Verify database availability

Command:
`npx prisma migrate status`

Initial result:
Prisma returned error `P1001` because SQL Server was unreachable on `localhost:1433`.

Cause:
Docker Desktop and the SQL Server container were not running.

Resolution:
- Docker Desktop was started.
- SQL Server container `gymx-sql` was started.

Verification:
`docker ps`
`npx prisma migrate status`

Final result:
- SQL Server container running successfully
- Prisma connected successfully
- Database schema reported as up to date

Impact:
The full local backend stack was verified before deployment preparation continued.

### Step 04 — Verify repository security configuration

Commands:
`git remote -v`
`cat .gitignore`

Result:
Configured remotes:
- `school`
- `personal`

Verified ignored files:
- `.env`
- `node_modules`
- `.prisma`

Impact:
Sensitive configuration and generated dependencies are excluded from version control.

### Step 05 — Verify production-style backend startup

Command:
`node src/server.js`

Verification:
Tested manually through Postman:
- `/health`
- authenticated endpoints
- database-connected endpoints

Result:
The backend started successfully without development tooling such as nodemon.

Impact:
This confirms the backend can run in a production-style runtime configuration.

Deployment consideration:
Prisma 6.19.3 is intentionally retained because earlier Prisma 7 migration attempts introduced configuration instability during development.

### Step 07 — Create deployment branch

Command:
`git checkout -b feature/lu24-deployment`

Result:
Deployment preparation branch created successfully from stable `master`.

Purpose:
Deployment-related configuration and infrastructure changes are isolated from the stable branch until validated.

### Step 08 — Verify runtime scripts

File:
`package.json`

Verified scripts:
```json
"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "test": "echo \"No tests configured yet\" && exit 0"
}
```

Result:
- Development runtime available through `npm run dev`
- Production-style runtime available through `npm start`
- Placeholder test script currently present

Deployment consideration:
The current deployment preparation focuses primarily on Postman/Newman integration testing and deployment validation. The placeholder npm test script does not block deployment preparation for the current MVP scope.

### Step 09 — Create environment variable template

File:
`.env.example`

Result:
A deployment-safe environment template was created without exposing secrets.

Configured variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`

Impact:
The application now documents which runtime configuration variables are required for deployment while preventing sensitive credentials from being committed to version control.

### Step 10 — Commit deployment preparation baseline

Commands:
`git add .`
`git commit -m "chore(deploy): prepare production runtime configuration"`

Result:
The initial LU24 deployment preparation changes were committed to the `feature/lu24-deployment` branch.

Included:
- deployment log
- deployment strategy documentation
- Git workflow documentation
- `.env.example`
- production runtime verification
- deployment readiness checks

Impact:
A stable deployment-preparation baseline now exists before containerization and cloud deployment begin.

### Step 11 — Amend deployment preparation commit

Commands:
`git add .env.example docs/lu-24-deployment-log.md`
`git commit --amend --no-edit`

Result:
The initial deployment preparation commit was amended to include final corrections to the environment template and deployment log documentation.

Impact:
The deployment-preparation baseline remains consolidated into one clean commit before containerization and cloud deployment work begins.

### Step 12 — Create containerization configuration

Files:
- `Dockerfile`
- `.dockerignore`

Result:
A Docker container configuration was added for the GYMX backend.

Dockerfile responsibilities:
- use Node.js runtime image
- install dependencies
- copy backend source files
- expose backend port
- start backend using `npm start`

`.dockerignore` excludes:
- `node_modules`
- `.env`
- `.git`
- documentation files

Impact:
The backend can now be built and executed in a reproducible containerized environment, which forms the basis for later Azure deployment.

### Step 13 — Build backend container image

Command:
`docker build -t gymx-backend .`

Result:
Docker successfully built the `gymx-backend` image using the provided Dockerfile.

Verification:
The Docker Desktop build overview reported:
- build completed successfully
- linux/amd64 platform
- Node.js backend image packaged successfully

Impact:
The backend application can now be packaged into a reproducible container image for deployment and runtime validation.

### Step 14 — Fix Prisma Client generation inside container

Command:
`docker run -p 3000:3000 --env-file .env gymx-backend`

Initial result:
The backend container started, but crashed because Prisma Client was not generated inside the Docker image.

Error:
`@prisma/client did not initialize yet. Please run "prisma generate"`

Cause:
The Docker image installed dependencies but did not run `npx prisma generate` during the image build.

Resolution:
The Dockerfile was updated to copy the Prisma schema and run `npx prisma generate` during image creation.

Impact:
This ensures Prisma Client is available inside the container at runtime.

### Step 15 — Resolve container database connection configuration

Initial result:
The backend container started successfully and `/health` returned `200 OK`, but database-connected endpoints returned `500 Internal Server Error`.

Cause:
The Docker-specific environment configuration contained quotation marks around the environment variable values. During container runtime, these quotation marks became part of the actual variable value, causing the Prisma SQL Server connection string to be parsed incorrectly.

Resolution:
Quotation marks were removed from the `.env.docker` configuration values.

Example:

Incorrect:
`DATABASE_URL="sqlserver://host.docker.internal:1433;..."`

Correct:
`DATABASE_URL=sqlserver://host.docker.internal:1433;...`

Verification:
- `/health` endpoint returned `200 OK`
- registration endpoint succeeded
- database-connected requests functioned correctly from inside the container

Impact:
The backend container can now successfully communicate with the SQL Server container through the Docker runtime configuration.

### Step 16 — Verify containerized backend flow

Verification:
The following endpoints were tested against the backend running inside Docker:

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/sessions`
- `GET /api/sessions`
- `GET /api/progress/current-week`
- protected endpoint without token
- invalid input scenario

Result:
The containerized backend successfully handled health checks, authentication, protected routes, database-connected endpoints and expected error responses.

Impact:
The backend container is functionally verified and ready for Azure deployment preparation.

### Step 17 — Complete local containerization validation

Verification performed:
- Docker image built successfully
- Backend container started successfully
- SQL Server container remained operational
- `/health` endpoint returned `200 OK`
- Authentication endpoints functioned correctly
- Database-connected endpoints functioned correctly
- Backend container successfully communicated with SQL Server

Additional findings:
- Prisma Client generation needed to occur during Docker image build
- Docker-specific environment configuration required `host.docker.internal`
- Quotation marks inside `.env.docker` values caused connection parsing issues and were removed

Impact:
The GYMX backend is now validated in a reproducible containerized runtime environment and is ready for cloud deployment preparation.