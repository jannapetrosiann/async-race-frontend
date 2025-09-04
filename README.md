# Async Race - Score: 380/400 pts

##  Live Demo
[https://cozy-pie-9b3ab9.netlify.app/](https://cozy-pie-9b3ab9.netlify.app/)

## GitHub Repo : https://github.com/jannapetrosiann/async-race-frontend.git

## About
A Single Page Application for managing a collection of cars, operating their engines, and showcasing race statistics. Built with React 18+ and TypeScript in strict mode.

## Features
- **Garage Management**: Create, edit, delete cars with color picker
- **Racing System**: Start/stop individual cars or race all cars
- **Winners Tracking**: Leaderboard with sorting and pagination  
- **Responsive Design**: Works on screens as small as 500px
- **Random Car Generation**: Create 100 random cars with one click

## Tech Stack
- React 18+ with TypeScript (strict mode)
- Zustand for state management
- CSS3 with custom animations
- ESLint (Airbnb config) + Prettier

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Start the backend API (separate repo): `npm start` in backend folder

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run format` - Format code with Prettier
- `npm run ci:format` - Check formatting issues

## Checklist 380/400 pts

### UI Deployment
- [x] Deployment Platform: Successfully deploy the UI on one of the following platforms: GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a similar service.

### ✅ Requirements to Commits and Repository
- [x] Commit guidelines compliance: Ensure that all commits follow the specified commit guidelines
- [x] Checklist included in README.md: Include the project's checklist in the README.md file
- [x] Score calculation: Use this checklist to calculate your score
- [x] UI Deployment link in README.md: Place the link to the deployed UI at the top of the README.md file

### Basic Structure (80/80 points)
- [x] Two Views (10 points): Implement two primary views: "Garage" and "Winners"
- [x] Garage View Content (30 points): The "Garage" view displays all required elements
- [x] Winners View Content (10 points): The "Winners" view displays name, table, and pagination
- [x] Persistent State (30 points): View state remains consistent when navigating between views

### Garage View (90/90 points)
- [x] Car Creation And Editing Panel. CRUD Operations (20 points): Create, update, and delete cars with validation
- [x] Color Selection (10 points): RGB color picker with visual feedback
- [x] Random Car Creation (20 points): Generate 100 random cars with varied names and colors
- [x] Car Management Buttons (10 points): Update and delete buttons for each car
- [x] Pagination (10 points): 7 cars per page with navigation
- [x] EXTRA POINTS (20 points): Empty garage handling and smart page navigation

### 🏆 Winners View (50/50 points)
- [x] Display Winners (15 points): Winners displayed in table after race completion
- [x] Pagination for Winners (10 points): 10 winners per page
- [x] Winners Table (15 points): Columns for №, image, name, wins, and best time
- [x] Sorting Functionality (10 points): Sort by wins and time, ascending/descending

### 🚗 Race (170/170 points)
- [x] Start Engine Animation (20 points): Smooth car animation with API integration
- [x] Stop Engine Animation (20 points): Return cars to starting position
- [x] Responsive Animation (30 points): Fluid animations on screens ≥500px
- [x] Start Race Button (10 points): Race all cars on current page
- [x] Reset Race Button (15 points): Return all cars to starting positions
- [x] Winner Announcement (5 points): Display winner message with car name
- [x] Button States (20 points): Proper button enabling/disabling based on car state
- [x] Actions during the race (50 points): Handle all user actions during active races

### 🎨 Prettier and ESLint Configuration (10/10 points)
- [x] Prettier Setup (5 points): format and ci:format scripts configured
- [x] ESLint Configuration (5 points): Airbnb style guide with strict TypeScript

### 🌟 Overall Code Quality (60/100 points - estimated)
- [x] Modular Design: Clear separation of concerns
- [x] Function Modularization: Functions under 40 lines
- [x] Code Duplication: Minimal duplication, no magic numbers
- [x] Readability: Clear variable and function names
- [x] Extra features: Custom hooks, proper TypeScript usage
