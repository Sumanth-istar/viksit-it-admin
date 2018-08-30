import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableResource, DataTable } from 'angular5-data-table';
import { LicenseService } from '../licensesService/license.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.css']
})
export class LicensesComponent implements OnInit {

  @ViewChild(DataTable) userTable: DataTable;
  complex_object
  isActiveLink = 'licenses'
  itemResource = new DataTableResource([]);
  items = [];
  itemCount = 0;
  counter = 1;
  limits = [10];
  orgID;
  licenseTypeData: NgOption[] = [];
  courseData: NgOption[] = [];
  form: FormGroup;
  public formErrors = {
    license: '',
    courses: '',
    users: ''
  };
  expireDates
  public searchText: string = "";

  constructor(private licenseService: LicenseService, private modalService: NgbModal, config: NgbDatepickerConfig) {
    config.minDate = { month: (new Date().getMonth() + 1), day: new Date().getDate(), year: new Date().getFullYear() };

  }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.orgID = this.complex_object.studentProfile.org_details[0].id


    this.getAllDataForLicenses();

  }

  open(content) {

    this.modalService.open(content, { size: 'lg' });

    this.form = new FormGroup({
      licenseType: new FormControl(null, Validators.compose([Validators.required])),
      courses: new FormControl(null, Validators.compose([Validators.required])),
      users: new FormControl(null, Validators.compose([Validators.required])),
      expireDate: new FormControl(null)
    });

  }

  getAllDataForLicenses() {


    this.licenseService.getAllLicenses(this.orgID).subscribe(
      // Successful responses call the first callback.
      data => {
        this.licenseTypeData = data['data'];

      },
      // Errors will call this callback instead:
      err => {

        console.log('Something went wrong!');
      });


    this.licenseService.getCourses(this.orgID).subscribe(
      // Successful responses call the first callback.
      data => {
        this.courseData = data['data'];
      },
      // Errors will call this callback instead:
      err => {

        console.log('Something went wrong!');
      });



  }





  reloadItems(params) {

    this.licenseService.getLicenses(params, this.counter, this.orgID, this.searchText).subscribe(
      // Successful responses call the first callback.
      data => {
        //   console.log(data['data'])
        if (data['draw'] == 1) {
          this.itemResource = new DataTableResource(data['data']);
          this.itemResource.query(params).then(items => this.items = items);
        } else {
          this.items = data['data'];
        }
        this.itemCount = data['recordsFiltered'];
        this.counter++;
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');
      }
    );

  }

  onSubmit() {

    console.log(this.form);
    let users = this.form.get('users').value + '';
    let licenseType = this.form.get('licenseType').value + '';
    let courses = this.form.get('courses').value;
    let date = this.form.get('expireDate').value;
    let expireDate = '';
    if (date) {
      expireDate = date.month + '/' + date.day + '/' + date.year
    }
    let license_object = { license_id: licenseType, license_count: users, course_ids: courses, expire_date: expireDate }
    console.log(license_object);


    this.licenseService.buyLicense(this.orgID, license_object).subscribe(
      data => {
        console.log(data['message']);
        this.reloadItems({ offset: 0, limit: 10 })
      },
      err => {
        console.log('Something went wrong!');
      }
    );


  }

}
