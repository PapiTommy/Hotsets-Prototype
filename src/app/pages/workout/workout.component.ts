import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'workout-component',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss']
})
export class WorkoutPage {
  global_countdown = 5;
  start_countdown = 5;
  subscription: Subscription;
  workout_toggle: string = 'fas fa-stop fa-2x'; // Toggle stop & play logo
  countdown_timer: string = this.global_countdown.toString();
  countdown_sub: string = '/5 Seconds';

  currentWorkoutIndex = 0;
  currentWorkoutTitle = '';
  durationSet = false;
  setCounter = false;
  setCounterText = 'NEXT SET';
  setRestInProgress = false;
  currentSet = 0;

  workoutPaused = false;
  historyStored = false;
  workoutStatus = 'start';
  workoutIcon = '';
  workout = [];
  storedWorkout = [];

  constructor(private route: Router) {}

  ngOnInit() {
    const count = interval(100);
    this.subscription = count.subscribe(val => this.count_down());
    this.currentWorkoutIndex = 0;
    this.durationSet = false;
    this.workoutStatus = 'start';
    this.workoutIcon = '';
    this.workoutPaused = false;
    this.historyStored = false;
    this.storedWorkout = [];
    var db = firebase.firestore();
    var uid = firebase.auth().currentUser.uid;
    var selectedDay = sessionStorage.getItem('startExercise');
    db.collection('users')
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.workout = doc.data()[selectedDay];
        } else {
          this.workout = [];
          this.currentWorkoutTitle = '';
        }
      })
      .catch(error => {
        console.log('Error getting document:', error);
      });
  }

  getAnimation() {
    if (this.workoutPaused == false) {
      if (
        this.workoutStatus == 'running' &&
        this.currentWorkoutIndex < this.workout.length &&
        this.durationSet == true &&
        this.workout[this.currentWorkoutIndex].type != 'repetition-exercise'
      ) {
        var duration = this.workout[this.currentWorkoutIndex].duration;
        return (
          'countdown ' + duration.toString() + 's linear infinite forwards'
        );
      } else if (this.workoutStatus == 'start') {
        return (
          'countdown ' + this.start_countdown + 's linear infinite forwards'
        );
      } else if (this.setRestInProgress == true) {
        var duration = this.workout[this.currentWorkoutIndex].rest_per_set;
        return (
          'countdown ' + duration.toString() + 's linear infinite forwards'
        );
      } else {
        return 'none';
      }
    } else {
      return 'none';
    }
  }

  getColor() {
    if (
      this.workoutStatus == 'running' &&
      this.currentWorkoutIndex < this.workout.length
    ) {
      if (this.workout[this.currentWorkoutIndex].type == 'timed-exercise') {
        return '#46237a';
      } else if (
        this.workout[this.currentWorkoutIndex].type == 'rested-exercise'
      ) {
        return '#ff495c';
      } else {
        return '#256eff';
      }
    } else {
      return 'rgba(138, 234, 192, 1)';
    }
  }

  pauseToggle() {
    if (this.workoutStatus != 'complete' && this.setCounter == false) {
      return 'workout-actions enabled';
    } else {
      return 'workout-actions disabled';
    }
  }

  backToggle() {
    if (this.workoutStatus == 'running' && this.currentWorkoutIndex != 0) {
      return 'workout-actions enabled';
    } else {
      return 'workout-actions disabled';
    }
  }

  forwardToggle() {
    if (this.workoutStatus == 'running') {
      return 'workout-actions enabled';
    } else {
      return 'workout-actions disabled';
    }
  }

  quitWorkout() {
    this.subscription;
    this.subscription.unsubscribe();
    this.route.navigate(['/home']);
  }

  count_down() {
    if (
      this.currentWorkoutIndex < this.workout.length &&
      this.workoutStatus == 'running'
    ) {
      if (
        this.durationSet == false &&
        this.workout[this.currentWorkoutIndex].type != 'repetition-exercise'
      ) {
        this.global_countdown = this.workout[this.currentWorkoutIndex].duration;
        if (this.workout[this.currentWorkoutIndex].type == 'timed-exercise') {
          this.currentWorkoutTitle = this.workout[
            this.currentWorkoutIndex
          ].exercise_name;
          this.workoutIcon = 'fas fa-stopwatch fa-1x';
        } else {
          this.currentWorkoutTitle = 'Rest';
          this.workoutIcon = 'far fa-clock fa-1x';
        }
        this.countdown_sub =
          '/' +
          this.workout[this.currentWorkoutIndex].duration.toString() +
          ' Seconds';
        this.durationSet = true;
      } else if (
        this.workout[this.currentWorkoutIndex].type == 'repetition-exercise' &&
        this.setRestInProgress == false
      ) {
        if (this.setCounter == false) {
          this.currentWorkoutTitle = this.workout[
            this.currentWorkoutIndex
          ].exercise_name;
          this.workoutIcon = 'fas fa-dumbbell fa-1x';
          this.currentSet = 1;
          this.setCounter = true;
        }
        this.countdown_timer = this.currentSet.toString();
        this.currentWorkoutTitle = this.workout[
          this.currentWorkoutIndex
        ].exercise_name;
        if (this.workout[this.currentWorkoutIndex].sets > 1) {
          this.countdown_sub =
            '/' + this.workout[this.currentWorkoutIndex].sets + ' Sets';
        } else {
          this.countdown_sub =
            '/' + this.workout[this.currentWorkoutIndex].sets + ' Set';
        }
        if (this.workout[this.currentWorkoutIndex].sets == this.currentSet) {
          this.setCounterText = 'COMPLETE SET';
        } else {
          this.setCounterText = 'NEXT SET';
        }
      } else if (this.setRestInProgress == true) {
        if (this.durationSet == false) {
          this.global_countdown = this.workout[
            this.currentWorkoutIndex
          ].rest_per_set;
          this.currentWorkoutTitle = 'Rest';
          this.countdown_sub =
            '/' +
            this.workout[this.currentWorkoutIndex].rest_per_set.toString() +
            ' Seconds';
          this.durationSet = true;
        }
      }
    } else if (
      this.workoutStatus == 'start' &&
      this.currentWorkoutIndex < this.workout.length
    ) {
      this.currentWorkoutTitle = 'Get Ready!';
      this.countdown_sub = '/' + this.start_countdown + ' Seconds';
    } else {
      this.currentWorkoutTitle = 'Workout Complete!';
      this.workoutStatus = 'complete';
      this.workoutIcon = '';
      this.countdown_timer = '0';
      if (this.historyStored == false && this.storedWorkout.length != 0) {
        this.historyStored = true;
        var db = firebase.firestore();
        var uid = firebase.auth().currentUser.uid;
        var date = Date.now();
        db.collection('history')
          .doc(uid)
          .set({ [date]: this.storedWorkout }, { merge: true })
          .then(() => {})
          .catch(error => {
            console.error('Error writing document: ', error);
            this.historyStored = false;
          });
      }
    }

    if (
      this.currentWorkoutIndex < this.workout.length &&
      (this.workoutStatus == 'start' ||
        this.workout[this.currentWorkoutIndex].type != 'repetition-exercise')
    ) {
      if (this.global_countdown <= 0.1) {
        if (this.workoutStatus == 'running') {
          this.storedWorkout.push(this.workout[this.currentWorkoutIndex]);
          this.currentWorkoutIndex = this.currentWorkoutIndex + 1;
          this.durationSet = false;
        } else if (this.workoutStatus == 'start') {
          this.workoutStatus = 'running';
        }
      } else {
        this.global_countdown = this.global_countdown - 0.1;
        this.countdown_timer = this.global_countdown.toFixed(1).toString();
      }
    } else if (this.setRestInProgress == true) {
      if (this.global_countdown <= 0.1) {
        if (this.currentSet > this.workout[this.currentWorkoutIndex].sets) {
          this.storedWorkout.push(this.workout[this.currentWorkoutIndex]);
          this.currentWorkoutIndex = this.currentWorkoutIndex + 1;
          this.durationSet = false;
          this.setCounter = false;
        } else {
          this.setCounter = true;
        }
        this.setRestInProgress = false;
      } else {
        this.global_countdown = this.global_countdown - 0.1;
        this.countdown_timer = this.global_countdown.toFixed(1).toString();
      }
    }
  }

  increaseSet() {
    this.currentSet = this.currentSet + 1;
    this.setRestInProgress = true;
    this.setCounter = false;
    this.durationSet = false;
  }

  toggleWorkout() {
    if (this.workoutStatus != 'complete') {
      if (this.workoutPaused == true) {
        const count = interval(100);
        this.subscription = count.subscribe(val => this.count_down());
        this.workout_toggle = 'fas fa-stop fa-2x';
        this.workoutPaused = false;
      } else {
        this.subscription && this.subscription.unsubscribe();
        if (this.workoutStatus == 'running') {
          if (
            this.workout[this.currentWorkoutIndex].type != 'repetition-exercise'
          ) {
            this.global_countdown = this.workout[
              this.currentWorkoutIndex
            ].duration;
          } else {
            this.global_countdown = this.workout[
              this.currentWorkoutIndex
            ].rest_per_set;
          }
        } else if (this.workoutStatus == 'start') {
          this.global_countdown = this.start_countdown;
        }
        this.countdown_timer = this.global_countdown.toFixed(1).toString();
        this.workout_toggle = 'fas fa-play fa-2x';
        this.workoutPaused = true;
      }
    }
  }

  goForward() {
    if (this.workoutPaused == true) {
      this.toggleWorkout();
    }
    if (
      this.currentWorkoutIndex < this.workout.length &&
      this.workoutStatus == 'running'
    ) {
      if (this.setRestInProgress == false) {
        this.currentWorkoutIndex = this.currentWorkoutIndex + 1;
        this.durationSet = false;
        this.setCounter = false;
      } else {
        this.global_countdown = 0;
      }
    }
  }

  goBack() {
    if (this.workoutPaused == true) {
      this.toggleWorkout();
    }
    if (
      this.currentWorkoutIndex < this.workout.length &&
      this.currentWorkoutIndex > 0 &&
      this.workoutStatus == 'running'
    ) {
      if (this.setRestInProgress == false) {
        this.currentWorkoutIndex = this.currentWorkoutIndex - 1;
        this.durationSet = false;
        this.setCounter = false;
      } else {
        this.global_countdown = 0;
        this.currentSet = this.currentSet - 1;
      }
    }
  }
}
