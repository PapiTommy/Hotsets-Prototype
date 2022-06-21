import { A } from '@angular/cdk/typings/keycodes';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'history-component',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryPage {
  workoutHistory = [];
  historyFound = false;

  constructor(private route: Router) {
    // Get workout history and store it in the array called workoutHistory
    var uid = firebase.auth().currentUser.uid; // Get the user ID
    var db = firebase.firestore(); // Define the firebase database
    db.collection('history') // Open the "history" database
      .doc(uid) // Filter to find data in the database that match that of the user ID
      .onSnapshot(doc => {
        // Get snapshot of all the data associated with the user
        for (var a in doc.data()) {
          // Loop through each field name in the retrieved data
          var obj = {};
          var previousDate = new Date(parseInt(a)); // Convert the fieldname (string) into a timestamp
          var currentDate = new Date(); // Get the current date
          var differenceInDays =
            (currentDate.getTime() - previousDate.getTime()) /
            (1000 * 3600 * 24); // Compare the days between the fieldname (timestamp) and the current time
          if (differenceInDays < 31) {
            // If it less than 31 push into the array "workoutHistory"
            obj[parseInt(a)] = doc.data()[a];
            this.workoutHistory.push(obj); // Push into array
            this.historyFound = true;
          } else {
            // If it is more than 30 delete it from the database
            db.collection('history')
              .doc(uid)
              .update({
                [a]: firebase.firestore.FieldValue.delete() // Delete field
              });
          }
        }

        // Sort history in descending order (based on the date registered) --> Bubble sort
        var end = this.workoutHistory.length;
        var finished = false;
        while (finished == false) {
          // Check if array has been sorted
          finished = true;
          var current = 0;
          var temp = null;
          while (current < end) {
            for (var x in this.workoutHistory[current]) {
              // Retrieve the field name of the current index
              var currentDate = new Date(parseInt(x)); // Convert to a timestamp
            }
            for (var x in this.workoutHistory[current + 1]) {
              // Retrieve the field name in the next index
              var nextDate = new Date(parseInt(x)); // Convert to a timestamp
            }
            if (currentDate < nextDate) {
              // Compare the two timestamps (if the current timestamp is smaller than the other one)
              // Switch the data (in descending order)
              temp = this.workoutHistory[current];
              this.workoutHistory[current] = this.workoutHistory[current + 1];
              this.workoutHistory[current + 1] = temp;
              finished = false;
            }
            current = current + 1;
          }
          end = end - 1;
        }
      });
  }

  returnHome() {
    this.route.navigate(['/home']);
    this.workoutHistory = [];
    this.historyFound = false;
  }
}
