# 🏗️ Architecture & Choix Techniques - Help Desk

Ce document est votre "Bible Technique" pour répondre aux questions du genre "Pourquoi tu as utilisé X ?" ou "Comment marche Y ?".

## 1. Le Backend (Le Cerveau)
**Technologie :** **FastAPI** (Python 3.11)

### Pourquoi ce choix ?
*   **Vitesse :** C'est un des frameworks Python les plus rapides (grâce à `Starlette` et `Pydantic`).
*   **Documentation Auto :** Il génère automatiquement le Swagger (la page `/docs`). Le prof adore ça.
*   **Moderne :** Il utilise le Python moderne avec les types (`str`, `int`) pour valider les données automatiquement.

### Comment ça marche ?
1.  **Routeur :** Reçoit la requête (ex: `GET /tickets`).
2.  **Pydantic (Schemas) :** Vérifie que les données envoyées sont correctes (ex: l'email est bien un email).
3.  **SQLAlchemy (ORM) :** Discute avec la base de données sans écrire de SQL (ex: `db.query(User).all()`).

---

## 2. Le Frontend (Le Visage)
**Technologie :** **React** (Vite + JavaScript)

### Pourquoi ce choix ?
*   **Composants :** On crée des briques réutilisables (`<Button />`, `<TicketCard />`). Code propre et organisé.
*   **Virtual DOM :** React ne met à jour que ce qui change à l'écran = Application ultra fluide.
*   **Vite :** Un outil de compilation beaucoup plus rapide que l'ancien "Create React App".

### Le Design
*   **Tailwind CSS :** Pas de fichiers CSS séparés. On écrit le style directement dans le HTML (ex: `class="bg-blue-500 rounded"`). C'est plus rapide à développer et plus facile à maintenir.
*   **Framer Motion :** Pour les petites animations fluides (les cartes qui apparaissent en glissant). Ça donne un aspect "Premium".

---

## 3. La Base de Données (La Mémoire)
**Technologie :** **PostgreSQL**

### Pourquoi ce choix ?
*   C'est le **SGBD relationnel** le plus robuste et professionnel (mieux que MySQL pour les projets complexes et la gestion des données JSON).
*   Il est Open Source et utilisé par les plus grandes entreprises.

---

## 4. DevOps (L'Infrastructure)
**Technologie :** **Docker & Docker Compose**

### Le concept clé : "Conteneurisation"
*   Au lieu d'installer Python, Node.js et Postgres sur votre PC, on crée des **boîtes virtuelles** (conteneurs) qui contiennent tout ce qu'il faut.
*   **Avantage tueur :** "Ça marche chez moi ? Alors ça marche chez toi !" Plus de problèmes de version ou de compatibilité entre Windows/Linux.

---

## ❓ Questions Pièges Possibles

**Q: C'est quoi un ORM ? (SQLAlchemy)**
**R:** *"C'est un traducteur. Il transforme mes objets Python (Classes) en lignes de base de données (SQL). Ça m'évite d'écrire du `SELECT * FROM...` à la main et protège contre les injections SQL."*

**Q: Pourquoi séparer Frontend et Backend ?**
**R:** *"Pour découpler les responsabilités. Si demain on veut créer une application Mobile, on peut garder le même Backend (API) et juste refaire le Frontend."*

**Q: C'est quoi le fichier `requirements.txt` ?**
**R:** *"C'est la liste de course de Python. Il dit à Docker quelles librairies installer (FastAPI, SQLAlchemy, etc.) pour que le projet fonctionne."*
