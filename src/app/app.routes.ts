import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RoomComponent} from "./room/room.component";

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
    component: RoomComponent
  },
];
