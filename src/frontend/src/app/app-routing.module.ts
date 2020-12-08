import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: ErrorComponent }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { useHash: true })] ,
  exports: [RouterModule]
})
export class AppRoutingModule { }
