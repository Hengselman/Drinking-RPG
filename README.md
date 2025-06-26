# 🍺 Drinking RPG

Een interactieve website voor drankspelletjes met RPG-elementen! Verdien XP door drankspellen te winnen en koop digitale kleding voor je pixel-art karakter.

## 🎮 Features

- **5 Save Slots**: Maak tot 5 verschillende karakters
- **Character Classes**: Barbaar, Magiër, Schutter, Paladijn
- **XP & Level System**: Verdien XP door drankspellen te winnen
- **Shop System**: Koop items en hoedjes met XP
- **Admin Panel**: Wijs XP toe aan spelers
- **Pixel Art Style**: Retro gaming esthetiek

## 🚀 Setup

### 1. Dependencies installeren
```bash
npm install
```

### 2. Firebase configureren
1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Maak een nieuw project aan
3. Voeg een web app toe
4. Kopieer de configuratie naar `src/firebase.js`
5. Zet Authentication aan (Email/Password)
6. Zet Firestore Database aan

### 3. Admin account maken
1. Maak een account aan met `Hengselman@gmail.com` en wachtwoord `!LikkenLachenLeiden4`
2. Open browser console (F12)
3. Voer uit: `makeUserAdmin('jouw-user-id')`

### 4. Development server starten
```bash
npm run dev
```

## 🎯 Hoe te gebruiken

### Voor Spelers:
1. **Account maken**: Registreer met email en wachtwoord
2. **Karakter maken**: Kies een save slot en maak je karakter
3. **Spelen**: Win drankspellen om XP te verdienen
4. **Shop**: Koop items en hoedjes met je XP

### Voor Admin:
1. **Inloggen**: Gebruik Hengselman@gmail.com
2. **Admin Panel**: Klik op "Admin Panel" knop
3. **XP Toewijzen**: Selecteer speler en voeg XP toe
4. **Beheren**: Bekijk alle spelers en hun karakters

## 🎨 Technische Details

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom Pixel Art
- **Backend**: Firebase (Auth + Firestore)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🍻 Drankspellen

- **Mexicaantje**: Dobbelspel met bier
- **Kingsen**: Kaartspel voor koningen  
- **Flip Cup**: Team bekerflip wedstrijd
- **Beer Pong**: Klassieke beker gooien
- **Ik Heb Nog Nooit**: Onthul je geheimen

## 📱 Responsive Design

De app werkt op desktop, tablet en mobiel met een mooie pixel-art interface.

## 🔧 Development

```bash
# Development server
npm run dev

# Build voor productie
npm run build

# Preview build
npm run preview
```

## 🎮 Veel plezier met jullie drankspelletjes! 🍺
