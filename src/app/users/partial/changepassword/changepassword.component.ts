import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  change_password: FormGroup;
  isValidPassword = false;
  constructor() { }

  ngOnInit() {

    this.change_password = new FormGroup({
      newPassword: new FormControl(null, Validators.compose([Validators.required])),
      confirmPassword: new FormControl(null, Validators.compose([Validators.required])),
    }, this.passwordMatchValidator);

  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword').value === g.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

}
