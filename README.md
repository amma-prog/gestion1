# Help Desk Pro - Système de Gestion de Tickets Premium

Un système de gestion de tickets ultra-moderne, sécurisé et performant, construit avec **React 19 (Frontend)** et **FastAPI (Backend)**. 
Conçu avec une interface "Cyberpunk" premium et un tableau de bord administration complet.

![Status](https://img.shields.io/badge/Status-Complete-success)
![Security](https://img.shields.io/badge/Security-Enterprise-blue)
![Theme](https://img.shields.io/badge/UI-Cyberpunk_Dark-purple)

## ✨ Fonctionnalités Majeures

### 🎨 Expérience Utilisateur Premium
- **Interface Cyberpunk** : Mode sombre, glassmorphism, arrière-plans animés et transitions fluides.
- **Tableau de Bord Intelligent** : S'adapte automatiquement au rôle (**Espace Étudiant**, **Espace Enseignant**, **Espace Employé**).
- **Création Intuitive** : Formulaire de ticket simplifié avec catégories visuelles.

### 🛡️ Administration & Sécurité
- **Super Admin Dashboard** :
  - 🚦 **Filtres Avancés** : Par Statut (Ouvert, Résolu), par Catégorie (Technique, Facturation...) ou par Rôle (Étudiant, Prof...).
  - ⚡ **Actions Rapides** : Suppression et mise à jour des tickets en un clic.
  - 👁️ **Audit Logs** : Traçabilité complète de toutes les actions critiques (qui a supprimé quoi et quand).
- **Sécurité Renforcée** : Authentification JWT, Hashage Argon2, Protection CSRF/CORS.

### 💬 Collaboration Temps Réel
- **Système de Chat** : Discussion intégrée sur chaque ticket.
- **Identification Visuelle** : Icônes distinctes pour les Admins (🛡️) et les Utilisateurs (👤).
- **Persistance Fiable** : Historique complet des conversations sauvegardé.

---

## 🚀 Installation & Démarrage (2 minutes)

### Prérequis
- Docker Desktop installé.

### Lancement
1.  Clonez ce dépôt.
2.  Ouvrez un terminal et lancez :
    ```bash
    docker-compose up --build
    ```
3.  C'est tout ! Le système s'initialise et crée les données de test automatiquement.

### Accès Rapide
- **Application Web :** [http://localhost:5173](http://localhost:5173)
- **API Docs (Swagger) :** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔑 Comptes de Démonstration
Utilisez ces comptes pour explorer les différents espaces :

| Rôle | Email | Mot de passe | Accès Spécial |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `admin@helpdesk.com` | `admin123` | **Accès Total**, Audit Logs, Suppression, Filtres Avancés. |
| **🎓 ÉTUDIANT** | `student@helpdesk.com` | `student123` | Création tickets (Catégorie: Student), Espace Étudiant. |
| **👨‍🏫 ENSEIGNANT** | `teacher@helpdesk.com` | `teacher123` | Création tickets (Catégorie: Teacher), Espace Enseignant. |
| **💼 EMPLOYÉ** | `employee@helpdesk.com` | `employee123` | Création tickets (Catégorie: Employee), Espace Employé. |

---

## 🛠️ Stack Technique

### Backend (Robustesse)
- **FastAPI** : Haute performance.
- **PostgreSQL** : Base de données fiable.
- **SQLAlchemy** : ORM sécurisé.
- **Docker** : Conteneurisation complète.

### Frontend (Modernité)
- **React 19 + Vite** : Rapidité extrême.
- **Tailwind CSS** : Styles atomiques.
- **Framer Motion** : Animations complexes.
- **Lucide React** : Icônes vectorielles.

---

## 📂 Structure du Projet
```bash
gestion1/
├── backend/              # Cerveau (API Python)
│   ├── routers/          # Routes (Auth, Tickets, Audit, Comments)
│   └── models.py         # Schéma de données
├── frontend/             # Visage (React App)
│   ├── src/pages/        # Dashboards, Login, CreateTicket...
│   └── src/context/      # Gestion d'état global
├── docker-compose.yml    # Orchestration
└── README.md             # Documentation
```

*Fait avec ❤️ pour le module DevOps/Développement Web.*
