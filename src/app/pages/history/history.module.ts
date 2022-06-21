import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { MatExpansionModule } from "@angular/material/expansion";

import { HistoryPage } from "./history.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatExpansionModule,
    RouterModule.forChild([
      {
        path: "",
        component: HistoryPage
      }
    ])
  ],
  declarations: [HistoryPage]
})
export class HistoryModule {}
