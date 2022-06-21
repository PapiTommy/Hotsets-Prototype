import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RecoveryPage } from "./recovery.component";
import { R } from "@angular/cdk/keycodes";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: RecoveryPage
      }
    ])
  ],
  declarations: [RecoveryPage]
})
export class RecoveryModule {}
