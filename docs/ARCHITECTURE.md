# Architecture du Projet Help Desk

## Vue d'ensemble

Le projet suit une architecture micro-services simplifiée, conteneurisée avec Docker.

## Composants

### 1. Frontend (React)
- **Framework**: React + Vite
- **Rôle**: Interface utilisateur pour la gestion des tickets.
- **Communication**: Appels REST vers l'API Backend.
- **Déploiement**: Nginx (Docker).

### 2. Backend (FastAPI)
- **Framework**: FastAPI (Python)
- **Rôle**: API REST, logique métier, validation des données.
- **Base de données**: PostgreSQL (via SQLAlchemy/AsyncPG - à configurer).
- **Déploiement**: Uvicorn (Docker).

### 3. Infrastructure (DevOps)
- **Docker Compose**: Orchestration locale.
- **GitHub Actions**: CI/CD (Tests, Linting, Security).

## Flux de Données

1.  L'utilisateur interagit avec le Frontend.
2.  Le Frontend envoie une requête HTTP au Backend.
3.  Le Backend traite la requête, interroge la DB (si nécessaire) et renvoie une réponse JSON.

## Sécurité

-   Scan de vulnérabilités avec Trivy.
-   Linting et analyse statique (Ruff, ESLint).
