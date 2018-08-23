import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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

  @Output() updateParent = new EventEmitter();
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

      this.licenseData = this.user.licenses
      this.groupData = this.user.groups;
      this.jobRoleData = this.user.job_roles;
      this.unitsData = this.user.units


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
      org: new FormControl(this.orgId.length != 0 ? this.orgId[0] : null, Validators.compose([Validators.required])),
    });

    this.form.valueChanges.subscribe((data) => {
      this.formErrors = this.validate.validateForm(this.form, this.formErrors, true)
    });

  }


  dataSetupForFilters() {

    this.orgData = this.createUserFormData.organizations
    this.userTypeData = this.createUserFormData.user_types
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


  changeOrg() {

    console.log(this.form.get('org').value);
    let orgID = this.form.get('org').value;
    if (orgID != undefined && orgID != null) {
      this.getUserCreationFormFields(orgID);
    }
  }


  getUserCreationFormFields(orgID) {

    this.userService.getNewUserCreationFormFields(orgID).subscribe(
      data => {

        console.log(data['data']);
        this.orgData = data['data'].organizations
        this.licenseData = data['data'].licenses
        this.groupData = data['data'].groups;
        this.jobRoleData = data['data'].job_roles;
        this.unitsData = data['data'].units

      },
      err => {

        console.log('Something went wrong!');

      }
    );

  }

  onSubmit() {
    if (this.form.valid) {
      this.updateParentFunction('turn_on_loader', null)

      let organizations = [{ id: this.form.get('org').value }];
      let user_types = [];
      let job_roles = [];
      let units = [];
      let licenses = [];
      let groups = [];

      this.form.get('userType').value.forEach(element => {
        user_types.push({ id: element });
      });
      this.jobRoleId.forEach(element => {
        job_roles.push({ id: element });
      });
      this.unitsId.forEach(element => {
        units.push({ id: element });
      });
      this.groupId.forEach(element => {
        groups.push({ id: element });
      });
      this.licenseId.forEach(element => {
        licenses.push({ id: element });
      });

      let user_object = {
        name: this.form.get('name').value,
        email: this.form.get('email').value,
        mobile: this.form.get('mobile').value,
        pincode: this.form.get('pincode').value,
        address_line_1: this.form.get('address1').value,
        address_line_2: this.form.get('address2').value,
        job_roles: job_roles,
        units: units,
        licenses: licenses,
        groups: groups,
        user_types: user_types,
        organizations: organizations
      };

      console.log(user_object);


      this.userService.createUser(this.organizationID, user_object).subscribe(
        data => {
          console.log(data['message']);
          this.updateParentFunction('turn_off_loader', { message: data['message'], type: "SUCCESS" });
        },
        err => {
          console.log('Something went wrong!');
          this.updateParentFunction('turn_off_loader', { message: 'Something went wrong!', type: "ERROR" });
        }
      );


    }
  }


  updateParentFunction(action, value) {
    let data = new Array<String>();
    data.push(action);
    data.push(value)
    this.updateParent.emit(data)

  }


}
