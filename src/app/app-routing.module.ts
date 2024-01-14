import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ConfirmarComponent } from './pages/confirmar/confirmar.component';

const routes: Routes = [
   {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'confirmar',
    component: ConfirmarComponent,
  },
  //{ path: '**', redirectTo: 'invitation' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
