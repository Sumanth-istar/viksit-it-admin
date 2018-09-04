import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../core/pojo/user';
import { CustomValidatorsService } from '../../users/userservice/custom-validators.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { ProfileService } from '../profileService/profile.service';
import { NgOption } from '@ng-select/ng-select';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  form: FormGroup;
  user: User = new User();
  timezones
  complex_object
  organizationID
  locationsList: NgOption[] = [];
  currenciesList: NgOption[] = [];
  languagesList: NgOption[] = [];
  public formErrors = {
    name: '',
    email: '',
    mobile: '',
    timeZone: '',
    locations: '',
    languages: '',
    currencies: ''
  };
  typeahead = new EventEmitter<string>();

  constructor(private profileService: ProfileService, private validate: CustomValidatorsService) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.organizationID = this.complex_object.studentProfile.org_details[0].id

    this.timezones = moment.tz.names();
    this.setUserForm();
    this.locationSearchFilter();

  }


  setUserForm() {


    this.form = new FormGroup({
      email: new FormControl({ value: this.user.email, disabled: this.user.id != null ? true : false }, Validators.compose([Validators.required, Validators.email])),
      mobile: new FormControl({ value: this.user.mobile, disabled: this.user.id != null ? true : false }, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),
      name: new FormControl(this.user.name, Validators.compose([Validators.required])),
      timeZone: new FormControl(null),
      locations: new FormControl(null),
      languages: new FormControl(null),
      currencies: new FormControl(null),
    });

    this.form.valueChanges.subscribe((data) => {
      this.formErrors = this.validate.validateForm(this.form, this.formErrors, true)
    });
  }


  locationSearchFilter() {

    this.typeahead
      .pipe(
        debounceTime(2000),
        switchMap(term => this.profileService.getLocation(this.organizationID, term))
      ).subscribe(data => {
        //    console.log(data['data']);
        this.locationsList = data['data'];
      }, (err) => {
        console.log('error', err);

      });

  }

  changeLocation() {
    //  console.log(this.form.get('locations').value);
    let numeric_code = this.form.get('locations').value
    this.currenciesList = []
    this.languagesList = [];
    this.form.get('languages').reset();
    this.form.get('currencies').reset();
    for (let location of this.locationsList) {
      if (location.numericCode == numeric_code) {
        this.currenciesList = location.currencies
        this.languagesList = location.languages
      }

    }


  }

}
