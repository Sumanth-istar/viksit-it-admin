import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../userservice/user.service';
import { User } from '../../../core/pojo/user';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  change_password: FormGroup;
  isValidPassword = false;
  @Input() user: User;
  @Output() updateParent = new EventEmitter();

  constructor(private userService: UserService) { }

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

  updateParentFunction(action, value) {
    let data = new Array<String>();
    data.push(action);
    data.push(value)
    this.updateParent.emit(data)
  }

  changePassword() {

    let password = this.change_password.get('newPassword').value
    this.change_password.get('confirmPassword').value

    this.userService.resetUserPassword(this.user.id, password).subscribe(
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
