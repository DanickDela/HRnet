# HRnet

HRnet est une application de gestion des employés développée avec React, dans le cadre du programme de formation Développeur Front-end JavaScript React chez OpenClassrooms. Elle permet de créer, consulter, rechercher, trier et supprimer des employés via une interface claire et responsive.

Ce projet a été réalisé dans le cadre d’un processus de modernisation front-end, remplaçant une ancienne application interne développée en jQuery par une architecture React.

## Fonctionnalités

### Gestion des employés

- Création d’employés via un formulaire avec validation
- Consultation des employés dans un tableau dynamique
- Suppression d'un employéavec fenêtre de confirmation
- Sauvegarde des données via le Local Storage

### Recherche & Tri

- Barre de recherche globale
- Recherche insensible aux accents
- Tri croissant / décroissant des colonnes

### UX / Accessibilité

- Design responsive (ordinateur / mobile)
- Labels accessibles sur les formulaires
- Fenêtres modales accessibles

## Technologies utilisées

- React
- React Router
- Redux Toolkit
- SCSS Modules
- React Data Table Component
- React Select
- React Datepicker
- Lucide React Icons

## Installation

```bash
git clone https://github.com/DanickDela/HRnet.git
cd hrnet
npm install
npm run dev
```

Le front-end sera lancé à l'URL: http://localhost:5173/.

## Identifiants de connexion

Utilisez les identifiants suivants pour accéder à l’application :

**Email :** admin.hrnet@gmail.com  
**Mot de passe :** admin123

## Structure du projet

```txt
src/
│── components/
│── pages/
│── store/
│── hooks/
│── utils/
│── styles/
│── assets/
```

## Pages principales

### Accueil

Page d’accueil de l’application.

### Connexion

Page d’authentification.

### Créer un employé

Formulaire d’ajout d’un nouvel employé.

### Voir les employés

Liste des employés avec recherche, tri, sélection et suppression.

## Persistance des données

Les employés sont stockés dans `localStorage`, ce qui permet de conserver les données après rechargement de la page.

## Auteur

Danick Delaroche

## Licence

Projet open-source disponible à des fins pédagogiques.
