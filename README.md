## Description

Software Developer Test - Backend.
Requirements:
- NestJS
- Authentication with JWT Token
- Unit test
- README with steps to run the project
- Running on PORT 3000
Optional:
- Postgres Database
- Sequelize ORM
- Swagger Docs
- Fastify Provider for NestJS
- Dockerfile
- Kubernetes deployment and service YAML

## Project setup

Rename template.env to .env

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start
# or
docker-compose up
# or kubectl

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Access Swagger Docs
```bash
$ http://localhost:3000/api
```

## Deploy using kubectl

```bash
# 0. build image
$ docker build -t todo-api:latest .

# 1. Create a namespace (optional, but recommended):
$ kubectl create namespace todo-api

# 2. Create ConfigMap:
$ kubectl apply -f app-config.yaml -n todo-api

# 3. Deploy Postgres:
$ kubectl apply -f postgres-deployment.yaml -n todo-api
$ kubectl apply -f postgres-service.yaml -n todo-api

# 4. Deploy application:
$ kubectl apply -f app-deployment.yaml -n todo-api
4 kubectl apply -f app-service.yaml -n todo-api

# 5. Check the status of deployments:
$ kubectl get deployments -n todo-api

# 6. Check the status of pods:
$ kubectl get pods -n todo-api

# 7. Check the status of services:
$ kubectl get services -n todo-api

# 8. View logs of a specific pod:
$ kubectl logs <pod-name> -n todo-api

# 9. Execute a command in a pod (e.g., to open a shell):
$ kubectl exec -it <pod-name> -n todo-api -- /bin/bash

# 10. Delete resources when you're done:
$ kubectl delete -f app-deployment.yaml -f app-service.yaml -f postgres-deployment.yaml -f postgres-service.yaml -n todo-api
$ kubectl delete configmap app-config -n todo-api

# 11. Delete the namespace (if you created one):
$ kubectl delete namespace todo-api
```