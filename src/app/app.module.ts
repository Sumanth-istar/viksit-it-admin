import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent } from './app.component';
import { NavComponent } from './core/nav/nav.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppRoutingModule } from './/app-routing.module';
import { Error404Component } from './core/error404/error404.component';
import { ErrorFieldComponent } from './core/error-field/error-field.component';
import { LoginComponent } from './login/login.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component';
import { DataTableModule } from 'angular5-data-table';
import { Select2Module } from 'ng2-select2';
import { UsermodalComponent } from './users/partial/usermodal/usermodal.component';
import { BulkuploadmodalComponent } from './users/partial/bulkuploadmodal/bulkuploadmodal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChangepasswordComponent } from './users/partial/changepassword/changepassword.component';
import { ViewGroupDetailsComponent } from './groups/partials/view-group-details/view-group-details.component';
import { CreateEditGroupComponent } from './groups/partials/create-edit-group/create-edit-group.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    Error404Component,
    ErrorFieldComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    GroupsComponent,
    UsermodalComponent,
    BulkuploadmodalComponent,
    ChangepasswordComponent,
    ViewGroupDetailsComponent,
    CreateEditGroupComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    SweetAlert2Module.forRoot(),
    NgxSpinnerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    DataTableModule.forRoot(),
    Select2Module,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
