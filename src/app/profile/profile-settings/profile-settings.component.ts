import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../core/pojo/user';
import { UserService } from '../../users/userservice/user.service';
import { CustomValidatorsService } from '../../users/userservice/custom-validators.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  form: FormGroup;
  user: User;
  public formErrors = {
    name: '',
    email: '',
    mobile: ''
  };
  constructor(private userService: UserService, private validate: CustomValidatorsService) { }

  ngOnInit() {
  }


  setUserForm() {


    this.form = new FormGroup({
      email: new FormControl({ value: this.user.email, disabled: this.user.id != null ? true : false }, Validators.compose([Validators.required, Validators.email])),
      mobile: new FormControl({ value: this.user.mobile, disabled: this.user.id != null ? true : false }, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),
      name: new FormControl(this.user.name, Validators.compose([Validators.required])),
    });

    this.form.valueChanges.subscribe((data) => {
      this.formErrors = this.validate.validateForm(this.form, this.formErrors, true)
    });
  }

}
