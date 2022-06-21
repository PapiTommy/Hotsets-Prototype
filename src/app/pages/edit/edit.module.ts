import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { EditPage } from "./edit.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DragDropModule,
    RouterModule.forChild([
      {
        path: "",
        component: EditPage
      }
    ])
  ],
  declarations: [EditPage]
})
export class EditModule {}
