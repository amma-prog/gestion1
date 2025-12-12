# Help Desk - Système de Gestion de Tickets

Un système de gestion de tickets (Help Desk) moderne et sécurisé, construit avec **React (Frontend)** et **FastAPI (Backend)**.

![Status](https://img.shields.io/badge/Status-Ready-green)
![Security](https://img.shields.io/badge/Security-High-blue)

## ✨ Fonctionnalités Clés
- 🔐 **Authentification Sécurisée** : Login avec JWT & Hachage Argon2.
- 👥 **Multi-Rôles** :
  - **Admin** : Gestion complète, vue globale, modification des statuts.
  - **Étudiant / Enseignant / Employé** : Vue filtrée (uniquement leurs propres tickets).
- 🎫 **Gestion des Tickets** : Création, Suivi (Open/In Progress/Resolved).
- 💬 **Commentaires** : Discussion sur chaque ticket.
- 🚀 **Installation Automatique** : Base de données pré-remplie au démarrage.

## 🚀 Installation Rapide (2 minutes)

### Prérequis
- Docker Desktop installé.

### Démarrage
1.  Clonez le projet (ou téléchargez le dossier).
2.  Ouvrez un terminal dans le dossier et lancez :
    ```bash
    docker-compose up --build
    ```
3.  Attendez que les conteneurs démarrent.
    > ℹ️ *Le système crée automatiquement les utilisateurs et distribue les tickets de test au premier lancement.*

### Accès
- **Application Web :** [http://localhost:5173](http://localhost:5173)
- **Documentation API (Swagger) :** [http://localhost:8000/docs](http://localhost:8000/docs)

## 🔑 Identifiants de Test
Le système est livré avec 4 comptes pré-configurés pour la démonstration :

| Rôle | Email | Mot de passe | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@helpdesk.com` | `admin123` | Accès total, peut tout voir et modifier. |
| **Étudiant** | `student@helpdesk.com` | `student123` | Peut créer et voir ses tickets (Catégorie: Student). |
| **Enseignant** | `teacher@helpdesk.com` | `teacher123` | Peut créer et voir ses tickets (Catégorie: Teacher). |
| **Employé** | `employee@helpdesk.com` | `employee123` | Peut créer et voir ses tickets (Catégorie: Employee). |

## 🛠️ Stack Technique

### Backend (API)
- **FastAPI (Python)** : Pour la performance et la validation automatique des données.
- **PostgreSQL** : Base de données relationnelle robuste.
- **SQLAlchemy** : ORM pour interagir avec la base de données de manière sécurisée (Anti-Injection SQL).
- **Argon2 + JWT** : Le standard actuel pour la sécurité des mots de passe et des sessions.

### Frontend (Interface)
- **React 19** : Framework moderne pour une interface fluide (Single Page Application).
- **Tailwind CSS** : Design system pour une interface propre et responsive.
- **Framer Motion** : Animations fluides.

## 🔒 Sécurité
Voir [SECURITY_EXPLAINED.md](SECURITY_EXPLAINED.md) pour les détails complets.
- **Rate Limiting** : Protection contre les attaques par force brute.
- **Isolation des données** : Un utilisateur ne peut jamais accéder aux données d'un autre (vérification serveur stricte).

## 📂 Structure du Projet
```
gestion1/
├── backend/              # API Python & Base de données
│   ├── main.py          # Point d'entrée & Auto-Seeding
│   ├── auth.py          # Gestion Sécurité
│   └── models.py        # Structure Base de données
├── frontend/            # Site Web React
│   └── src/             # Code source Interface
├── docker-compose.yml   # Orchestration (Lancement en 1 clic)
└── README.md            # Ce fichier
```

---
*Projet réalisé dans le cadre du module DevOps/Développement Web.*
