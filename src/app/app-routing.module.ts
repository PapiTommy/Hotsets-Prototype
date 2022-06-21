import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: "./pages/home/home.module#HomeModule"
  },
  {
    path: "edit",
    loadChildren: "./pages/edit/edit.module#EditModule"
  },
  {
    path: "workout",
    loadChildren: "./pages/workout/workout.module#WorkoutModule"
  },
  {
    path: "history",
    loadChildren: "./pages/history/history.module#HistoryModule"
  },
  {
    path: "login",
    loadChildren: "./pages/login/login.module#LoginModule"
  },
  {
    path: "signup",
    loadChildren: "./pages/signup/signup.module#SignupModule"
  },
  {
    path: "recovery",
    loadChildren: "./pages/recovery/recovery.module#RecoveryModule"
  },
  { path: "", redirectTo: "login", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
