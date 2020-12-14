import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events.component';


const routes: Routes = [
  {
      path: '', component: EventsComponent
      /*children: [
          { path: 'history', component: HistoryComponent },
          { path: 'create', component: CreateEventComponent },
          { path: 'edit', component: EditEventComponent }
      ] */
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRootingModule { }
