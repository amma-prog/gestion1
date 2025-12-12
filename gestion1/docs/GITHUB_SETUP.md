# Comment mettre le projet sur GitHub

## Étape 1 : Crée un compte GitHub (si tu n'en as pas)
Va sur [github.com](https://github.com) et crée un compte gratuit.

## Étape 2 : Crée un nouveau repository

1. Va sur GitHub et clique sur le **+** en haut à droite
2. Sélectionne **"New repository"**
3. Remplis les informations :
   - **Repository name** : `help-desk` (ou le nom que tu veux)
   - **Description** : "Système de gestion de tickets (Help Desk) avec React et FastAPI"
   - **Public** ou **Private** : choisis selon tes préférences
   - **NE COCHE PAS** "Add a README file" (on en a déjà un)
4. Clique sur **"Create repository"**

## Étape 3 : Pousse ton code vers GitHub

Ouvre PowerShell dans ton dossier de projet et exécute ces commandes **dans l'ordre** :

```powershell
# Va dans le dossier du projet (si tu n'y es pas déjà)
cd "c:\Users\Nouar\.gemini\antigravity\playground\quantum-hawking"

# Configure ton identité Git (change avec tes infos)
git config user.name "Ton Nom"
git config user.email "ton.email@example.com"

# Ajoute tous les fichiers
git add .

# Crée ton premier commit
git commit -m "Initial commit: Help Desk Application"

# Ajoute l'URL de ton repo GitHub (remplace VOTRE_USERNAME par ton nom d'utilisateur GitHub)
git remote add origin https://github.com/VOTRE_USERNAME/help-desk.git

# Pousse le code vers GitHub
git push -u origin main
```

Si `git push` échoue avec une erreur sur "master" vs "main", essaie :
```powershell
git branch -M main
git push -u origin main
```

## Étape 4 : Vérifie sur GitHub

Va sur ton repository GitHub, tu devrais voir tous tes fichiers !

## Étape 5 : Invite tes coéquipiers

1. Sur ton repo GitHub, clique sur **"Settings"**
2. Dans le menu de gauche, clique sur **"Collaborators"**
3. Clique sur **"Add people"**
4. Entre leur nom d'utilisateur GitHub ou email

## 📌 Conseils pour le travail en équipe

### Branches recommandées
```bash
# Crée des branches pour chaque membre/fonctionnalité
git checkout -b backend-dev      # Pour le backend
git checkout -b frontend-dev     # Pour le frontend
git checkout -b devops-config    # Pour la config DevOps
git checkout -b documentation    # Pour les docs
```

### Workflow Git recommandé
1. Crée une branche pour ta tâche : `git checkout -b ma-nouvelle-fonctionnalité`
2. Fais tes modifications
3. Commit : `git commit -m "Description de ce que tu as fait"`
4. Push : `git push origin ma-nouvelle-fonctionnalité`
5. Sur GitHub, crée une **Pull Request**
6. Un autre membre de l'équipe review et merge

## 🔧 Prochaines étapes

- [ ] Ajoute des screenshots dans `docs/screenshots/`
- [ ] Configure GitHub Actions (déjà fait dans `.github/workflows/`)
- [ ] Crée des Issues pour organiser le travail
- [ ] Utilise les GitHub Projects pour le suivi

Bon courage avec ton projet DevOps ! 🚀
