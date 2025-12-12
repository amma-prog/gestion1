# 🛡️ Guide de Sécurité - Help Desk Project

Ce document explique les mesures de sécurité mises en place pour la soutenance du projet.

## 1. Vue d'ensemble (L'Architecture)
Nous utilisons une architecture **Stateless** (sans état) basée sur des **Tokens JWT**.
*   **Pourquoi ?** C'est le standard moderne. Le serveur ne garde pas les sessions en mémoire, ce qui permet de passer à l'échelle (Scalability) facilement.

## 2. Hachage des Mots de Passe (Password Hashing)
*   **Technologie :** Algorithme **Argon2**.
*   **Pourquoi ?** C'est l'algorithme gagnant de la "Password Hashing Competition". Il est beaucoup plus sécurisé que MD5 ou SHA256 car il est conçu pour résister aux attaques par force brute sur cartes graphiques (GPU).
*   **Preuve pour le Prof :**
    *   *Ouvrez la base de données (Table `users`).*
    *   *Montrez la colonne `hashed_password`.*
    *   *On ne voit pas "123456", mais une chaîne complexe comme `$argon2id$v=19$m=65536...`.*

## 3. Authentification & Tokens (JWT)
*   **Technologie :** JSON Web Tokens (OAuth2 Password Bearer).
*   **Fonctionnement :**
    1.  L'utilisateur envoie Email + Password.
    2.  Le serveur vérifie et renvoie un "Token" crypté (la clé d'hôtel).
    3.  Pour chaque action suivante (voir tickets, créer ticket), l'utilisateur montre ce Token.
*   **Sécurité :** Le token est signé avec une clé secrète (`SECRET_KEY`). Si un pirate essaie de modifier le token (ex: changer son rôle de "étudiant" à "admin"), la signature ne correspondra plus et le serveur rejettera la demande.

## 4. Contrôle d'Accès (RBAC - Role Based Access Control)
*   **Principe :** Le "Moindre Privilège" (Least Privilege).
*   **Implémentation :**
    *   **Admin :** Peut tout voir et modifier les statuts.
    *   **Utilisateur :** Ne peut voir **QUE** ses propres tickets (filtrage SQL strict : `owner_id == current_user.id`).
*   **Test pour le Prof :**
    1.  *Connectez-vous en tant qu'Étudiant.*
    2.  *Essayez de modifier le statut d'un ticket (Action Admin).*
    3.  *Résultat : Le bouton n'est pas là (Frontend) et l'API renvoie une erreur `403 Forbidden` si on essaie de forcer (Backend).*

## 5. Protection Anti-Attaques (Rate Limiting)
*   **Technologie :** SlowAPI.
*   **Mesure :** Limite de **100 requêtes / minute** par adresse IP.
*   **Pourquoi ?** Empêche les attaques par Déni de Service (DDoS) et le "Brute Force" (essayer 1000 mots de passe à la seconde).

---

## 🧪 Scénarios de Test pour la Démo

### Test A : Isolation des Données (Confidentialité)
1.  Connectez-vous avec `student@helpdesk.com`.
2.  Créez un ticket "Problème Wifi".
3.  Déconnectez-vous.
4.  Connectez-vous avec `employee@helpdesk.com`.
5.  **Vérification :** L'employé ne voit PAS le ticket "Problème Wifi". La confidentialité est assurée.

### Test B : Sécurité des Statuts (Intégrité)
1.  En tant qu'étudiant, ouvrez les détails d'un ticket.
2.  **Vérification :** Il n'y a pas de menu déroulant pour changer le statut (Open -> Resolved). Seul l'Admin a ce pouvoir.

### Test C : Robustesse (Disponibilité)
1.  Spammez le bouton "Rafraîchir" ou essayez de vous connecter 100 fois très vite.
2.  **Vérification :** Le serveur finira par renvoyer "429 Too Many Requests" pour se protéger.
