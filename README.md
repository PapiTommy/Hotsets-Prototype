# Hotsets
Hotsets is a mobile application that tracks weekly workouts - more specifically the time between sets, reps, and rests.

The Ionic 4 framework and Firebase are used to create a fully functioning application, with the appropriate user authentication and storage. The application includes a register, login, workout timetable, countdown, and history page.

### Register and Login:
- Uses firebase authentication to authenticate users (Set Email/password as the Sign-in provider)

### Workout timetable:
- A fully customisable weekly workout, contains three customisable elements (rep/set based exercises, timed exercises and rests)
- Weekly workout timetables can be modified by the user in real time.
- All saved workouts are saved in the firestore database.

### Countdown:
- Each customized workout has a "Play" option that guides the user through their workout using a countdown timer.

### History:
- Stores the users workouts upon completion, documenting the time and exercises completed.
- Workout history is saved in the firestore database.

<br/>

## Storyboard

![Hotsets Storyboard](https://i.imgur.com/DxOugFU.jpg)
