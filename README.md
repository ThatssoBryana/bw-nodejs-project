# bw-nodejs-project

Dit project is een Node.js webapplicatie die CRUD (Create, Read, Update, Delete) operaties heeft voor het beheren van gebruikers en nieuwsberichten van mijn laravel project (bw-laravel-project).

## Inleiding

BW-nodejs-project is een eenvoudige Node.js applicatie die basis CRUD-operaties demonstreert met behulp van Express.js en Sequelize voor interactie me tmijn MySQL database van mijn eerdere laravel project. Het stelt gebruikers in staat om gebruikersaccounts en nieuwsberichten te beheren via een RESTful API.

## Kenmerken

- CRUD-eindpunten voor gebruikers en nieuwsitems.
- Middleware voor het valideren van gebruikers- en nieuwsgegevens.
- Eindpunten voor het zoeken naar records op basis van specifieke velden (/gebruikers/zoeken en /nieuws/zoeken).
- Eindpunten voor het ophalen van een beperkt aantal records met een offset (/gebruikers en /nieuws).

## Vereisten

Voordat je het project kunt uitvoeren, zorg ervoor dat je het volgende hebt geïnstalleerd:
- Node.js
- npm (Node Package Manager)
- MySQL

### Installatie

1. Kloon de repository naar je lokale machine: git clone <repository-url>
2. Navigeer naar de projectdirectory: cd BW-nodejs-project
3. Installeer de afhankelijkheden: npm install
4. Configureer je MySQL-database en update de `sequelize`-configuratie in `server.js` met je databasegegevens.
5. Start de applicatie: npm start



