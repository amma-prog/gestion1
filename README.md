# Help Desk - Système de Gestion de Tickets

Un système de gestion de tickets (Help Desk) moderne et animé, construit avec React et FastAPI dans le cadre d'un projet DevOps.

![Preview](https://img.shields.io/badge/Status-Ready-green)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## ✨ Fonctionnalités

- 🔐 **Authentification** : Page de login animée avec email/mot de passe
- 📊 **Dashboard** : Statistiques en temps réel (Total, Open, In Progress, Resolved)
- 🎫 **Gestion des Tickets** : Création, affichage et filtrage des tickets
- 👥 **Catégories** : Étudiant, Enseignant, Employé
- 🎨 **Design Premium** : Interface moderne avec Tailwind CSS et Framer Motion
- 🚀 **Animations fluides** : Micro-animations pour une meilleure UX

## 🛠️ Stack Technique

### Frontend
- **React** 19.2.0 avec Vite
- **Tailwind CSS** v4 (Design System)
- **Framer Motion** (Animations)
- **React Router** (Navigation)
- **Lucide React** (Icônes)

### Backend
- **FastAPI** (API REST)
- **Python** 3.11
- **Pytest** (Tests)

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** (CI/CD)
- **PostgreSQL** (Base de données)

## 🚀 Installation et Lancement

### Prérequis
- **Docker Desktop** installé et lancé
- **Git** installé

### Étapes

1. **Clone le repository**
```bash
git clone https://github.com/VOTRE_USERNAME/help-desk.git
cd help-desk
```

2. **Lance l'application avec Docker**
```bash
docker-compose up --build
```

3. **Accède à l'application**
- Frontend : [http://localhost:5173](http://localhost:5173)
- Backend API : [http://localhost:8000](http://localhost:8000)
- Documentation API : [http://localhost:8000/docs](http://localhost:8000/docs)

## 📂 Structure du Projet

```
help-desk/
├── backend/              # API FastAPI
│   ├── main.py          # Point d'entrée de l'API
│   ├── requirements.txt # Dépendances Python
│   └── Dockerfile       # Container Backend
├── frontend/            # Application React
│   ├── src/
│   │   ├── pages/      # Pages (Login, Dashboard, CreateTicket)
│   │   ├── context/    # State management (TicketContext)
│   │   └── utils/      # Utilitaires
│   ├── Dockerfile      # Container Frontend
│   └── nginx.conf      # Configuration Nginx
├── .github/workflows/   # CI/CD GitHub Actions
├── docs/               # Documentation
├── docker-compose.yml  # Orchestration
└── README.md           # Ce fichier
```

## 🎯 Utilisation

### 1. Se connecter
- Ouvre [http://localhost:5173](http://localhost:5173)
- Entre n'importe quel email/mot de passe (pour l'instant)
- Clique sur "Se connecter"

### 2. Dashboard
- Visualise les statistiques des tickets
- Filtre par catégorie (Tous, Étudiant, Enseignant, Employé)
- Consulte la liste des tickets récents

### 3. Créer un ticket
- Clique sur "New Ticket"
- Remplis le formulaire :
  - Titre
  - Description
  - Priorité (Low/Medium/High)
  - Catégorie (Étudiant/Enseignant/Employé)
- Clique sur "Create Ticket"

## 🧪 Tests

```bash
# Tests Backend
docker-compose exec backend pytest

# Linting Backend
docker-compose exec backend ruff check .
```

## 📝 Guide de Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les règles de contribution.

## 🔄 CI/CD

Le projet utilise GitHub Actions pour :
- ✅ Tester le backend (Pytest)
- ✅ Builder le frontend
- 🔒 Scanner les vulnérabilités (Trivy)

## 📸 Screenshots

### Login Page
![Login](docs/screenshots/login.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Create Ticket
![Create Ticket](docs/screenshots/create-ticket.png)

## 👥 Équipe

Ce projet a été développé dans le cadre d'un projet DevOps collaboratif.

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvre une [Issue](https://github.com/VOTRE_USERNAME/help-desk/issues)
- Consulte la [Documentation](docs/ARCHITECTURE.md)

---

Fait avec ❤️ pour le projet DevOps
