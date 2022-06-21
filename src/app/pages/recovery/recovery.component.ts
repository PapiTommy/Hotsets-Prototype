import { Component } from "@angular/core";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import "firebase/auth";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "recovery-component",
  templateUrl: "./recovery.component.html",
  styleUrls: ["./recovery.component.scss"]
})
export class RecoveryPage {
  public recoveryForm: FormGroup;
  public authError: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    public alertController: AlertController
  ) {
    this.recoveryForm = formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ]
    });
  }

  public async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: "alert-popup",
      header: "Password reset confirmation was sent",
      message:
        "You can now reset your password with the link sent to your email.",
      buttons: ["Dismiss"]
    });
    await alert.present();
  }

  recover() {
    firebase
      .auth()
      .sendPasswordResetEmail(this.recoveryForm.value.email)
      .then(() => {
        this.recoveryForm.reset();
        this.authError = "";
        this.recoveryForm = this.formBuilder.group({
          email: [
            "",
            Validators.compose([
              Validators.required,
              Validators.maxLength(100),
              Validators.pattern(
                "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
              )
            ])
          ]
        });
        this.route.navigate(["/login"]);
        this.presentAlert();
      })
      .catch(error => {
        this.authError = error.toString().slice(7);
      });
  }
}
