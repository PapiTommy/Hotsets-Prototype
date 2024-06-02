# Hotsets

Hotsets is a mobile application that tracks weekly workouts, focusing on the time between sets, reps and rests.

Built with the Ionic 4 framework and Firebase, Hotsets offers robust user authentication and data storage. The application features a register, login, workout timetable, countdown timer, and history page.

## Features

### Register and Login
- Utilizes Firebase authentication to secure user accounts (Email/password as the sign-in provider).

### Workout Timetable
- Fully customizable weekly workout schedules.
- Supports three exercise types: rep/set-based exercises, timed exercises, and rest periods.
- Users can modify their workout timetables in real-time.
- All workouts are saved in the Firestore database.

### Countdown
- Each workout includes a "Play" option that guides users through their routines with a countdown timer.

### History
- Stores completed workouts, documenting the time and exercises performed.
- Workout history is saved in the Firestore database.

## Configuration

Replace the current Firebase config with your configuration details in `src/app/app.component.ts`.

## Note

This was my first project, so feel free to optimize and improve it.

## Storyboard

![Hotsets Storyboard](https://i.imgur.com/DxOugFU.jpg)

## Contributing

We welcome contributions to improve Hotsets! Please fork the repository and submit pull requests.
