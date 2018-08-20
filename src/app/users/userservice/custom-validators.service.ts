import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor(private userService: UserService) { }

  public validateForm(formToValidate: FormGroup, formErrors: any, checkDirty?: boolean) {
    const form = formToValidate;
    const messages = this.validationMessages();

    for (const field in formErrors) {
      if (field && field === 'email') {
        formErrors[field] = '';
        const control = form.get(field);

        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              formErrors[field] = formErrors[field] || messages[key];
            }
          }
        } else if (control && control.valid) {
          if (control.value.trim() != '') {

            this.userService.getUserExist(control.value).subscribe(
              data => {
                console.log(data['data'])
                if (data['data'].message === 'This email is valid') {
                } else {
                  formErrors[field] = formErrors[field] || messages['emailIsNotValid'];
                }
              },
              err => {
                formErrors[field] = formErrors[field] || messages['emailIsNotValid'];
                console.log('Something went wrong!');
              }
            );
          }
        }
      } else if (field && field === 'mobile') {
        formErrors[field] = '';
        const control = form.get(field);

        let mobile = control.value + '';
        if (control.value && mobile.length != 10) {
          formErrors[field] = formErrors[field] || messages['mobile'];
        } else if (control.valid && control.value && mobile.length == 10) {

          this.userService.getMobileExist(control.value).subscribe(
            data => {
              console.log(data['data'])
              if (data['data'].message === 'This mobile is valid') {
              } else {
                formErrors[field] = formErrors[field] || messages['mobileIsNotValid'];
              }
            },
            err => {
              formErrors[field] = formErrors[field] || messages['mobileIsNotValid'];
              console.log('Something went wrong!');
            }
          );


        } else {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              if (key && key == 'required') {
                formErrors[field] = formErrors[field] || messages[key];
              }
            }
          }
        }



      } else if (field && field === 'pinId') {
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              if (key && key == 'required') {
                formErrors[field] = formErrors[field] || messages[key];
              }
            }
          }
        }
      } else if (field && field === 'orgId') {
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              if (key && key == 'required') {
                formErrors[field] = formErrors[field] || messages[key];
              }
            }
          }
        }
      } else if (field && field === 'userType') {
        formErrors[field] = '';
        const control = form.get(field);
        if (control && !control.valid) {
          if (!checkDirty || (control.dirty || control.touched)) {
            for (const key in control.errors) {
              if (key && key == 'required') {
                formErrors[field] = formErrors[field] || messages[key];
              }
            }
          }
        }
      } else {
        if (field) {
          formErrors[field] = '';
          const control = form.get(field);
          if (control && !control.valid) {
            if (!checkDirty || (control.dirty || control.touched)) {
              for (const key in control.errors) {
                if (key && key == 'required') {
                  formErrors[field] = formErrors[field] || messages[key];
                }
              }
            }
          }
        }

      }



    }

    return formErrors;
  }


  // return list of error messages
  public validationMessages() {
    const messages = {
      required: 'This field is required',
      email: 'This email address is invalid',
      emailIsNotValid: 'User already exists with this email',
      mobileIsNotValid: 'User already exists with this mobile',
      mobile: 'Must be a valid 10 digit phone number',
      mobileDomain: 'number already exist'
    };

    return messages;
  }
}
