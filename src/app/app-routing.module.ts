import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { Error404Component } from './core/error404/error404.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component';
import { ViewGroupDetailsComponent } from './groups/partials/view-group-details/view-group-details.component';
import { CreateEditGroupComponent } from './groups/partials/create-edit-group/create-edit-group.component';

const routes: Routes = [{ path: '', redirectTo: '/app-login', pathMatch: 'full', canActivate: [AuthGuard] },
{ path: 'app-login', component: LoginComponent },
{ path: 'app-dashboard', component: DashboardComponent },
{ path: 'app-users', component: UsersComponent },
{ path: 'app-groups', component: GroupsComponent },
{ path: 'app-view-group-details/:id', component: ViewGroupDetailsComponent },
{ path: 'app-create-edit-group/:id', component: CreateEditGroupComponent },





// otherwise redirect to 404
{ path: '**', component: Error404Component }
];

@NgModule({ imports: [RouterModule.forRoot(routes, { useHash: true })], exports: [RouterModule] })

export class AppRoutingModule { }
