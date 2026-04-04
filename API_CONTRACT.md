# API Contract — ETWMS
Last updated: 2026-04-04

## Base URL
Development: http://localhost:5000

## Auth Header
All protected routes: Authorization: Bearer <token>

## Error Format
{ "success": false, "message": "string" }

## Success Format
{ "success": true, "data": { ... } }

## Notes
- JWT payload shape: { "userId": "<ObjectId string>", "role": "admin|manager|employee", "iat": ..., "exp": ... }
- Role values: admin | manager | employee
- Task status: pending | in-progress | completed
- Project status: planning | active | completed

## Auth Endpoints

### POST /api/auth/login
- Auth: Public
- Body:
```json
{ "email": "string", "password": "string" }
```
- Success 200:
```json
{
	"success": true,
	"data": {
		"token": "jwt",
		"user": {
			"_id": "ObjectId",
			"name": "string",
			"email": "string",
			"role": "admin|manager|employee",
			"teamId": "ObjectId|null"
		}
	}
}
```

### POST /api/auth/register
- Auth: Protected (admin only)
- Body:
```json
{
	"name": "string",
	"email": "string",
	"password": "string",
	"role": "admin|manager|employee",
	"teamId": "ObjectId|null"
}
```
- Success 201:
```json
{
	"success": true,
	"data": {
		"user": {
			"_id": "ObjectId",
			"name": "string",
			"email": "string",
			"role": "admin|manager|employee"
		}
	}
}
```

### GET /api/auth/me
- Auth: Protected
- Success 200:
```json
{ "success": true, "data": { "user": { "...": "profile fields" } } }
```

## User Endpoints

### GET /api/users
- Auth: Protected (admin only)
- Success 200:
```json
{ "success": true, "data": { "users": [ { "...": "user fields without password" } ] } }
```

### GET /api/users/:id
- Auth: Protected (admin only)
- Success 200:
```json
{ "success": true, "data": { "user": { "...": "user fields without password" } } }
```

### PUT /api/users/:id
- Auth: Protected (admin only)
- Body (any subset):
```json
{
	"name": "string",
	"role": "admin|manager|employee",
	"teamId": "ObjectId|null",
	"isActive": true,
	"password": "string"
}
```
- Success 200:
```json
{ "success": true, "data": { "user": { "...": "updated user fields without password" } } }
```

## Team Endpoints

### POST /api/teams
- Auth: Protected (admin only)
- Body:
```json
{
	"name": "string",
	"managerId": "ObjectId",
	"memberIds": ["ObjectId"]
}
```
- Success 201:
```json
{ "success": true, "data": { "team": { "...": "team fields" } } }
```

### GET /api/teams
- Auth: Protected (admin only)
- Success 200:
```json
{ "success": true, "data": { "teams": [ { "...": "team fields" } ] } }
```

### PUT /api/teams/:id
- Auth: Protected (admin only)
- Body: partial team fields
- Success 200:
```json
{ "success": true, "data": { "team": { "...": "updated team fields" } } }
```

### DELETE /api/teams/:id
- Auth: Protected (admin only)
- Success 200:
```json
{ "success": true, "data": { "message": "Team deleted" } }
```

## Project Endpoints

### POST /api/projects
- Auth: Protected (manager only)
- Body:
```json
{
	"title": "string",
	"description": "string",
	"teamId": "ObjectId",
	"startDate": "ISO date",
	"endDate": "ISO date"
}
```
- Success 201:
```json
{ "success": true, "data": { "project": { "...": "project fields" } } }
```

### GET /api/projects
- Auth: Protected (manager, admin)
- Behavior: managers receive only their projects, admins receive all.
- Success 200:
```json
{ "success": true, "data": { "projects": [ { "...": "project fields" } ] } }
```

### GET /api/projects/:id
- Auth: Protected (manager, admin)
- Success 200:
```json
{ "success": true, "data": { "project": { "...": "project fields" } } }
```

### PUT /api/projects/:id
- Auth: Protected (manager only)
- Body: partial project fields including status.
- Success 200:
```json
{ "success": true, "data": { "project": { "...": "updated project fields" } } }
```

### DELETE /api/projects/:id
- Auth: Protected (manager only)
- Success 200:
```json
{ "success": true, "data": { "message": "Project deleted" } }
```

## Task Endpoints

### POST /api/tasks
- Auth: Protected (manager only)
- Body:
```json
{
	"title": "string",
	"description": "string",
	"projectId": "ObjectId",
	"assignedTo": "ObjectId",
	"priority": "low|medium|high",
	"deadline": "ISO date"
}
```
- Success 201:
```json
{ "success": true, "data": { "task": { "...": "task fields" } } }
```

### GET /api/tasks/my
- Auth: Protected (employee only)
- Success 200:
```json
{ "success": true, "data": { "tasks": [ { "...": "task fields" } ] } }
```

### GET /api/tasks/:projectId
- Auth: Protected
- Success 200:
```json
{ "success": true, "data": { "tasks": [ { "...": "task fields" } ] } }
```

### PUT /api/tasks/:id
- Auth: Protected (employee, manager)
- Body: partial task fields including status.
- Success 200:
```json
{ "success": true, "data": { "task": { "...": "updated task fields" } } }
```

### POST /api/tasks/:id/comment
- Auth: Protected
- Body:
```json
{ "text": "string" }
```
- Success 200:
```json
{ "success": true, "data": { "comment": { "...": "new comment object" } } }
```

### DELETE /api/tasks/:id
- Auth: Protected (manager only)
- Success 200:
```json
{ "success": true, "data": { "message": "Task deleted" } }
```

## Dashboard Endpoints

### GET /api/dashboard/admin
- Auth: Protected (admin only)
- Success 200:
```json
{
	"success": true,
	"data": {
		"userCount": 0,
		"teamCount": 0,
		"projectCount": 0,
		"taskCount": 0,
		"recentLogs": []
	}
}
```

### GET /api/dashboard/manager
- Auth: Protected (manager only)
- Success 200:
```json
{ "success": true, "data": { "projects": [], "tasks": [] } }
```

### GET /api/dashboard/employee
- Auth: Protected (employee only)
- Success 200:
```json
{
	"success": true,
	"data": {
		"tasks": [],
		"stats": { "pending": 0, "inProgress": 0, "completed": 0 }
	}
}
```

### GET /api/dashboard/logs?page=1&limit=20&userId=&entityType=&action=
- Auth: Protected (admin only)
- Success 200:
```json
{
	"success": true,
	"data": {
		"logs": [],
		"total": 0,
		"page": 1,
		"limit": 20
	}
}
```

## Socket Events (Current Contract)
- task:assigned => { taskId, title, assignedTo, projectId }
- task:updated => { taskId, status, updatedBy }
- task:commented => { taskId, comment, userId }
- project:closed => { projectId, title }
- notification:new => { message, type, entityId }

## Socket Rooms (Current Contract)
- user:{userId}
- project:{projectId}
- team:{teamId}