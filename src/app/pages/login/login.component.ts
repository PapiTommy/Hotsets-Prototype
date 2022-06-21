import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginPage {
  public authForm: FormGroup;
  public authError: string = '';

  constructor(private formBuilder: FormBuilder, private route: Router) {
    this.authForm = formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(16)])
      ]
    });
  }

  password_type: string = 'password';
  eye_status: string = 'fas fa-eye fa-lg clickable';

  togglePasswordMode() {
    if (this.password_type == 'text') {
      this.eye_status = 'fas fa-eye fa-lg clickable';
      this.password_type = 'password';
    } else {
      this.eye_status = 'fas fa-eye-slash fa-lg clickable';
      this.password_type = 'text';
    }
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.authForm.value.email,
        this.authForm.value.password
      )
      .then(async userCredential => {
        var db = firebase.firestore();
        var databaseError = false;
        await db
          .collection('users')
          .doc(userCredential.user.uid)
          .get()
          .then(async docSnapshot => {
            if (!docSnapshot.exists) {
              await db
                .collection('users')
                .doc(userCredential.user.uid)
                .set({
                  monday: [],
                  tuesday: [],
                  wednesday: [],
                  thursday: [],
                  friday: [],
                  saturday: [],
                  sunday: []
                })
                .catch(error => {
                  databaseError = true;
                  console.error('Error writing document: ', error);
                });
            }
            if (databaseError == false) {
              this.authForm.reset();
              this.authError = '';
              this.authForm = this.formBuilder.group({
                email: [
                  '',
                  Validators.compose([
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern(
                      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
                    )
                  ])
                ],
                password: [
                  '',
                  Validators.compose([
                    Validators.required,
                    Validators.maxLength(16)
                  ])
                ]
              });
              this.route.navigate(['/home']);
            }
          });
      })
      .catch(error => {
        this.authError = error.toString().slice(7);
      });
  }
}
