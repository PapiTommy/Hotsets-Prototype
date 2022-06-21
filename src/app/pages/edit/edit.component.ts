import { Component, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'edit-component',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EditPage {
  public addRepExercise: FormGroup;
  public addTimedExercise: FormGroup;
  public addRest: FormGroup;
  public repError: string = '';
  public timedError: string = '';
  public restError: string = '';
  public exercises = [];

  constructor(private formBuilder: FormBuilder, private route: Router) {
    var db = firebase.firestore();
    var uid = firebase.auth().currentUser.uid;
    var updateDay = sessionStorage.getItem('editExercise');
    db.collection('users')
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.exercises = doc.data()[updateDay];
        } else {
          this.exercises = [];
        }
      })
      .catch(error => {
        console.log('Error getting document:', error);
      });
    this.addRepExercise = formBuilder.group({
      exercise_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(26)])
      ],
      sets: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern('^[0-9]*$')
        ])
      ],
      rest_per_set: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]*$')
        ])
      ],
      repetitions: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$')
        ])
      ]
    });
    this.addTimedExercise = formBuilder.group({
      exercise_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(26)])
      ],
      duration: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]*$')
        ])
      ]
    });
    this.addRest = formBuilder.group({
      duration: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]*$')
        ])
      ]
    });
  }

  // exercises = [];

  // constructor(private formBuilder: FormBuilder) {
  //   this.addRepExercise = formBuilder.group({
  //     // Validators for the "Repetition” exercise form
  //     exercise_name: [
  //       // The Exercise Name is required and must have a max length of 26 characters
  //       "",
  //       Validators.compose([Validators.required, Validators.maxLength(26)])
  //     ],
  //     sets: [
  //       // The number of Sets is required, must be a number and have a max length of 3 characters
  //       "",
  //       Validators.compose([
  //         Validators.required,
  //         Validators.maxLength(3),
  //         Validators.pattern("^[0-9]*$")
  //       ])
  //     ],
  //     rest_per_set: [
  //       // The duration (seconds) between each set is required, must be a number and have a max length of 5 characters
  //       "",
  //       Validators.compose([
  //         Validators.required,
  //         Validators.maxLength(5),
  //         Validators.pattern("^[0-9]*$")
  //       ])
  //     ],
  //     repetitions: [
  //       // The repetitions for each set is required, must be a number and have a max length of 4 characters
  //       "",
  //       Validators.compose([
  //         Validators.required,
  //         Validators.maxLength(4),
  //         Validators.pattern("^[0-9]*$")
  //       ])
  //     ]
  //   });
  // }

  submitRepExercise() {
    // Adds a "Repetition" exercise to the array called "exercises"
    if (this.addRepExercise.valid == false) {
      // Checks if the form has been validated properly
      this.repError = 'Please make sure all fields are filled in correctly.'; // If validation fails return an error
    } else {
      var addRepObject = {}; // Define an object, which will be later pushed into an array
      addRepObject['exercise_name'] = this.addRepExercise.value.exercise_name; // Add the exercise name to the object, according to exercise name submitted
      addRepObject['type'] = 'repetition-exercise'; // Add the exercise type to the object
      addRepObject['sets'] = parseInt(this.addRepExercise.value.sets); // Add the sets to the object, according to the sets submitted
      addRepObject['rest_per_set'] = parseInt(
        this.addRepExercise.value.rest_per_set // Add the rest per set to the object, according to the rest per set submitted
      );
      addRepObject['repetitions'] = parseInt(
        this.addRepExercise.value.repetitions // Add the repetitions to the object, according to the repetitions submitted
      );
      this.exercises.push(addRepObject); // Push the object to the array called exercises
    }
  }

  submitTimedExercise() {
    if (this.addTimedExercise.valid == false) {
      this.timedError = 'Please make sure all fields are filled in correctly.';
    } else {
      var addTimedObject = {};
      addTimedObject[
        'exercise_name'
      ] = this.addTimedExercise.value.exercise_name;
      addTimedObject['type'] = 'timed-exercise';
      addTimedObject['duration'] = parseInt(
        this.addTimedExercise.value.duration
      );
      this.exercises.push(addTimedObject);
    }
  }

  submitRest() {
    if (this.addRest.valid == false) {
      this.restError = 'Please make sure the duration is filled in correctly.';
    } else {
      var addRestObject = {};
      addRestObject['type'] = 'rested-exercise';
      addRestObject['duration'] = parseInt(this.addRest.value.duration);
      this.exercises.push(addRestObject);
    }
  }

  add_exercise: string = 'add-timed';
  add_exercise_icon: string = 'fas fa-stopwatch fa-3x';
  bottom_selection_style: string = 'timed-background';
  rep_exercise_form: boolean = true;
  timed_exercise_form: boolean = false;
  rest_form: boolean = true;

  toggleAddExercise_Repetition() {
    this.add_exercise = 'add-repetition';
    this.add_exercise_icon = 'fas fa-dumbbell fa-3x';
    this.bottom_selection_style = 'repetition-background';
    this.rep_exercise_form = false;
    this.timed_exercise_form = true;
    this.rest_form = true;
    this.resetForms();
  }

  toggleAddExercise_Rest() {
    this.add_exercise = 'add-rest';
    this.add_exercise_icon = 'far fa-clock fa-3x';
    this.bottom_selection_style = 'rest-background';
    this.rep_exercise_form = true;
    this.timed_exercise_form = true;
    this.rest_form = false;
    this.resetForms();
  }

  toggleAddExercise_Timed() {
    this.add_exercise = 'add-timed';
    this.add_exercise_icon = 'fas fa-stopwatch fa-3x';
    this.bottom_selection_style = 'timed-background';
    this.rep_exercise_form = true;
    this.timed_exercise_form = false;
    this.rest_form = true;
    this.resetForms();
  }

  resetForms() {
    this.addRepExercise.reset();
    this.repError = '';
    this.addRepExercise = this.formBuilder.group({
      exercise_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(26)])
      ],
      sets: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern('^[0-9]*$')
        ])
      ],
      rest_per_set: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]*$')
        ])
      ],
      repetitions: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(4),
          Validators.pattern('^[0-9]*$')
        ])
      ]
    });
    this.addTimedExercise.reset();
    this.timedError = '';
    this.addTimedExercise = this.formBuilder.group({
      exercise_name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(26)])
      ],
      duration: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]*$')
        ])
      ]
    });
    this.addRest.reset();
    this.restError = '';
    this.addRest = this.formBuilder.group({
      duration: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern('^[0-9]*$')
        ])
      ]
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.exercises, event.previousIndex, event.currentIndex);
  }

  delete(index) {
    if (index == 0) {
      this.exercises.shift();
    } else {
      this.exercises.splice(index, index);
    }
  }

  async updateExercise() {
    var db = firebase.firestore();
    var uid = firebase.auth().currentUser.uid;
    var updateDay = sessionStorage.getItem('editExercise');
    await db
      .collection('users')
      .doc(uid)
      .update({
        [updateDay]: this.exercises
      })
      .then(() => {
        this.resetForms();
        this.route.navigate(['/home']);
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
  }
}
