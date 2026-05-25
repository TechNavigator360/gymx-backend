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
- [ ] Confirm local baseline is complete
- [ ] Check current branch: `git branch --show-current`
- [ ] Check clean status: `git status`
- [ ] Create deployment branch:
      `git checkout -b feature/lu24-deployment`
- [ ] Commit deployment log so far:
      `git add docs/lu24-deployment-log.md`
      `git commit -m "docs(lu24): add deployment preparation log"`

### Phase 1 — Production readiness
- [x] Verify `server.js` uses `process.env.PORT || 3000`
- [x] Verify `.env` is ignored
- [ ] Create `.env.example` without secrets
- [x] Check `package.json` scripts:
      `start`, `dev`, possibly `test`
- [x] Run local startup:
      `node src/server.js`
- [x] Test in Postman:
      `/health`, login, protected endpoint
- [ ] Commit:
      `git add .`
      `git commit -m "chore(deploy): prepare production runtime configuration"`

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