import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/delay';
import { CustomValidatorsService } from '../../userservice/custom-validators.service';
import { NgOption } from '@ng-select/ng-select';
import { UserService } from '../../userservice/user.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { User } from '../../../core/pojo/user';

@Component({
  selector: 'app-usermodal',
  templateUrl: './usermodal.component.html',
  styleUrls: ['./usermodal.component.css']
})
export class UsermodalComponent implements OnInit {

  form: FormGroup;
  @Input() createUserFormData;
  @Input() user: User
  userTypeData: NgOption[] = [];
  groupData = [];
  licenseData = [];
  orgData: NgOption[] = [];
  jobRoleData = [];
  unitsData = [];
  pinCodeData: NgOption[] = [];
  skillData = [];
  typeahead = new EventEmitter<string>();
  skillSearch = new EventEmitter<string>();
  groupId = [];
  licenseId = [];
  unitsId = [];
  jobRoleId = [];
  userTypes = [];
  orgId = [];
  currentJustify = 'fill';
  complex_object
  organizationID
  isSkillFound = false;
  selectedSkill;
  studProfile;
  courses;
  public formErrors = {
    name: '',
    email: '',
    mobile: '',
    org: '',
    userType: '',
    address1: '',
    address2: '',
    pincode: ''
  };

  constructor(private userService: UserService, private validate: CustomValidatorsService) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.organizationID = this.complex_object.studentProfile.org_details[0].id

    this.dataSetupForFilters();
    this.setUserForm();
    this.pinCodeSearchFilter();
    this.skillSearchFilter()


  }

  setUserForm() {
    if (this.user.id != null) {

      this.userSkill(this.user.id);
      this.userProfile(this.user.id);

      for (let group of this.user.groups) {
        if (group.is_mapped) {
          this.groupId.push(group.id);
        }
      }
      for (let license of this.user.licenses) {
        if (license.is_mapped) {
          this.licenseId.push(license.id);
        }
      }
      for (let unit of this.user.units) {
        if (unit.is_mapped) {
          this.unitsId.push(unit.id);
        }
      }
      for (let jobRole of this.user.job_roles) {
        if (jobRole.is_mapped) {
          this.jobRoleId.push(jobRole.id);
        }
      }
      for (let orgnization of this.user.orgnizations) {
        if (orgnization.is_mapped) {
          this.orgId.push(orgnization.id);
        }
      }
      for (let user_role of this.user.user_roles) {
        if (user_role.is_mapped) {
          this.userTypes.push(user_role.id);
        }
      }



    }

    this.form = new FormGroup({
      email: new FormControl({ value: this.user.email, disabled: this.user.id != null ? true : false }, Validators.compose([Validators.required, Validators.email])),
      mobile: new FormControl({ value: this.user.mobile, disabled: this.user.id != null ? true : false }, [Validators.required]),
      name: new FormControl(this.user.name, Validators.compose([Validators.required])),
      address1: new FormControl(this.user.address_line_1, Validators.compose([Validators.required])),
      address2: new FormControl(this.user.address_line_2, Validators.compose([Validators.required])),
      pincode: new FormControl(this.user.pincode, Validators.compose([Validators.required])),
      userType: new FormControl(this.userTypes, Validators.compose([Validators.required])),
      org: new FormControl(this.orgId, Validators.compose([Validators.required])),
    });

    this.form.valueChanges.subscribe((data) => {
      this.formErrors = this.validate.validateForm(this.form, this.formErrors, true)
    });

  }


  dataSetupForFilters() {

    this.orgData = this.createUserFormData.organizations
    this.userTypeData = this.createUserFormData.user_types
    this.licenseData = this.createUserFormData.licenses
    this.groupData = this.createUserFormData.groups;
    this.jobRoleData = this.createUserFormData.job_roles;
    this.unitsData = this.createUserFormData.units


  }

  pinCodeSearchFilter() {

    this.typeahead
      .pipe(
        debounceTime(2000),
        switchMap(term => this.userService.getPinCodeExist(term))
      )
      .subscribe(data => {
        // console.log(data['data']);
        this.pinCodeData = [];
        this.pinCodeData = data['data']
      }, (err) => {
        console.log('error', err);
        this.pinCodeData = [];
      });

  }


  skillSearchFilter() {

    this.isSkillFound = false;

    this.skillSearch
      .pipe(
        debounceTime(2000),
        switchMap(term => this.userService.getSkillDetails(term, this.organizationID))
      )
      .subscribe(data => {

        this.skillData = [];
        this.skillData = data['data']

        if (this.skillData[0].message) {
          this.isSkillFound = true;
        }


      }, (err) => {
        console.log('error', err);
        this.skillData = [];
        this.isSkillFound = true;
      });

  }

  saveUserSkills() {

    let skills = { 'skills': this.selectedSkill };

    console.log(skills);
    this.userService.saveUserSkill(skills, this.user.id).subscribe(data => {

    }, (err) => {
      console.log('error', err);

    });
  }

  userSkill(usrId) {
    console.log(usrId);
    this.userService.getUserSkill(usrId).subscribe(
      // Successful responses call the first callback.
      data => {
        this.selectedSkill = data['data'].skills;
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');
      });
  }

  userProfile(usrId) {
    console.log(usrId);
    this.userService.getUserProfile(usrId).subscribe(
      // Successful responses call the first callback.
      data => {
        this.studProfile = null
        this.courses = null;
        this.courses = data['courses'];
        this.studProfile = data['studentProfile']
      },
      // Errors will call this callback instead:
      err => {
        this.studProfile = null
        this.courses = null;
        console.log('Something went wrong!');
      });
  }


}
