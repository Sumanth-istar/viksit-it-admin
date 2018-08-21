import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { AuthService } from './service/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  @ViewChild('loginerrorSwal') private loginerrorSwal: SwalComponent;
  loginError: string;
  welcome = 'Welcome';
  constructor(private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService, private auth: AuthService) { }

  ngOnInit() {

    this.form = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]))
    });
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/app-dashboard'], { relativeTo: this.route });
    }

  }

  isFieldValid(field: string) {
    if (this.form != undefined) {
      return !this.form.get(field).valid && this.form.get(field).touched;
    } else {
      return false;
    }

  }

  isValid(field: string) {
    if (this.form != undefined) {
      return this.form.get(field).valid && this.form.get(field).touched;
    } else {
      return false;
    }

  }

  displayFieldCss(field: string) {
    return {
      'has-danger': this.isFieldValid(field),
      'has-success': this.isValid(field)
    };
  }

  onSubmit() {
    this.spinner.show();
    if (this.form.valid) {
      console.log('form submitted');
      const req = this.auth.authenticate(this.form.get('email').value, this.form.get('password').value);
      req.subscribe(
        // Successful responses call the first callback.
        data => {
          this.auth.login(data);
          this.spinner.hide();
          this.router.navigate(['/app-dashboard'], { relativeTo: this.route });
        },
        // Errors will call this callback instead:
        err => {
          this.spinner.hide();
          this.loginerrorSwal.text = err.error.istarViksitProComplexKey
          this.loginerrorSwal.show();
          console.log('Something went wrong!');

        }
      );
    } else {
      console.log('form invalid');
      this.spinner.hide();
      this.loginerrorSwal.text = 'Something went wrong!'
      this.loginerrorSwal.show();
    }
  }
}
