import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Slides } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  public mondayExerciseExists: Boolean = false;
  public tuesdayExerciseExists: Boolean = true;
  public wednesdayExerciseExists: Boolean = true;
  public thursdayExerciseExists: Boolean = true;
  public fridayExerciseExists: Boolean = true;
  public saturdayExerciseExists: Boolean = true;
  public sundayExerciseExists: Boolean = true;
  public mondayExercise = [];
  public tuesdayExercises = [];
  public wednesdayExercises = [];
  public thursdayExercises = [];
  public fridayExercises = [];
  public saturdayExercises = [];
  public sundayExercises = [];

  constructor(private route: Router) {
    var uid = firebase.auth().currentUser.uid;
    var db = firebase.firestore();
    db.collection('users')
      .doc(uid)
      .onSnapshot(doc => {
        if (doc.data().monday.length == 0) {
          this.mondayExerciseExists = false;
        } else {
          this.mondayExerciseExists = true;
          this.mondayExercise = doc.data().monday;
        }
        if (doc.data().tuesday.length == 0) {
          this.tuesdayExerciseExists = false;
        } else {
          this.tuesdayExerciseExists = true;
          this.tuesdayExercises = doc.data().tuesday;
        }
        if (doc.data().wednesday.length == 0) {
          this.wednesdayExerciseExists = false;
        } else {
          this.wednesdayExerciseExists = true;
          this.wednesdayExercises = doc.data().wednesday;
        }
        if (doc.data().thursday.length == 0) {
          this.thursdayExerciseExists = false;
        } else {
          this.thursdayExerciseExists = true;
          this.thursdayExercises = doc.data().thursday;
        }
        if (doc.data().friday.length == 0) {
          this.fridayExerciseExists = false;
        } else {
          this.fridayExerciseExists = true;
          this.fridayExercises = doc.data().friday;
        }
        if (doc.data().saturday.length == 0) {
          this.saturdayExerciseExists = false;
        } else {
          this.saturdayExerciseExists = true;
          this.saturdayExercises = doc.data().saturday;
        }
        if (doc.data().sunday.length == 0) {
          this.sundayExerciseExists = false;
        } else {
          this.sundayExerciseExists = true;
          this.sundayExercises = doc.data().sunday;
        }
      });
  }

  goForward() {
    this.slides.slideNext();
  }

  goBack() {
    this.slides.slidePrev();
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.route.navigate(['/login']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  editExercise(day) {
    sessionStorage.setItem('editExercise', day);
    this.route.navigate(['/edit']);
  }

  startExercise(day) {
    sessionStorage.setItem('startExercise', day);
    this.route.navigate(['/workout']);
  }

  previewHistory() {
    this.route.navigate(['/history']);
  }
}
