# Bot Gendarmerie Nationale — CORG / IGGN / Identification

Bot Discord.js v14 en **Components V2**, statut **en stream « Gendarmerie Nationale »**.

## Fonctions
- **Appel 17 (CORG)** : formulaire → post dans le forum `FORUM_APPEL17_ID`, puis ping du rôle `ROLE_GENDARMERIE_ID` dans un message **sous** le composant V2.
- **IGGN** : choix du motif → formulaire → post dans le forum `FORUM_IGGN_ID` (ping `ROLE_IGGN_ID` si défini).
- **Identification** : demande Prénom/Nom RP → NIGEND à 6 chiffres (2 premiers = `NIGEND_PREFIX`) → pseudo `J Dupont 「170042」`.

## Installation
1. `npm install`
2. Copier `.env.example` en `.env` (en local) ou renseigner les variables dans Railway.
3. `npm start`
4. Dans un salon, lancer `/setup` (admin) : envoie les 3 panneaux, chacun avec son image.

## Permissions du bot
Gérer les pseudos, Gérer les rôles (si `ROLE_IDENTIFIE_ID`), Envoyer des messages, Créer des posts / Envoyer des messages dans les posts.
Son rôle doit être **au-dessus** de ceux des membres à renommer (le propriétaire du serveur ne peut pas être renommé).

## Railway
- Variables : voir `.env.example`.
- Les NIGEND sont enregistrés dans `DATA_DIR/nigend.json` : ajouter un **Volume** Railway (ex. `/data`) et mettre `DATA_DIR=/data`, sinon le fichier est perdu à chaque déploiement.
- `STREAM_URL` doit être un lien Twitch ou YouTube pour que le statut « En stream » s'affiche.

## Personnalisation
Tout est dans `src/config.js` : textes des panneaux, couleur, motifs IGGN, images, statut.
Les champs des formulaires sont dans `src/features/*.js`.
