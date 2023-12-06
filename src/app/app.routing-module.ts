import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RoomComponent} from "./room/room.component";
import {NgModule} from "@angular/core";
import {RoomsGuard} from "./rooms.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'room/:id',
    canActivate: [RoomsGuard],
    component: RoomComponent,
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
