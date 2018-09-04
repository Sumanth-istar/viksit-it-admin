import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../userservice/user.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-bulkuploadmodal',
  templateUrl: './bulkuploadmodal.component.html',
  styleUrls: ['./bulkuploadmodal.component.css']
})
export class BulkuploadmodalComponent implements OnInit {

  licenseData = [];
  groupData = [];
  @Input() createUserFormData;
  @Output() updateParent = new EventEmitter();
  formErrors = [];
  formValid = true;
  groupId;
  licenseId;
  complex_object
  organizationID
  file: File;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.licenseData = this.createUserFormData.licenses
    this.groupData = this.createUserFormData.groups;

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.organizationID = this.complex_object.studentProfile.org_details[0].id
  }

  fileUpload(event) {
    this.formValid = true;
    this.formErrors = []
    this.file = event.target.files[0]
    // console.log(event);
    if (this.file.name.split('.')[1]) {

      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (e) => {
        this.userService.bulkUploadCheck(event).takeUntil(this.ngUnsubscribe).subscribe(
          data => {
            //   console.log(data);
            if (data['errors']) {
              this.formErrors = data['errors'];
            } else if (data['message'] === 'successful') {
              this.formValid = false;
            }
          },
          err => {
            console.log('Something went wrong!');
            this.formErrors = [{ message: 'Something went wrong!' }]
            this.formValid = true;
          }
        );
      }
    } else {
      alert('Invalid file.')
    }
  }




  uploadUserData(event) {

    this.formValid = false;
    this.formErrors = []
    //  console.log(event);
    if (this.file.name.split('.')[1]) {
      this.updateParentFunction('turn_on_loader', null)
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (e) => {
        this.userService.bulkUpload(this.file, this.groupId, this.licenseId, this.organizationID).takeUntil(this.ngUnsubscribe).subscribe(
          data => {
            //   console.log(data);
            if (data['errors']) {
              this.formErrors = data['errors'];
              this.updateParentFunction('turn_off_loader', { message: 'Something went wrong!', type: "ERROR" });
            } else if (data['message'] === 'successful') {
              this.updateParentFunction('turn_off_loader', { message: data['message'], type: "SUCCESS" });
            }
          },
          err => {
            console.log('Something went wrong!');
            this.formErrors = [{ message: 'Something went wrong!' }]
            this.formValid = false;
            this.updateParentFunction('turn_off_loader', { message: 'Something went wrong!', type: "ERROR" });
          }
        );
      }
    } else {
      alert('Invalid file.')
    }
  }


  updateParentFunction(action, value) {
    let data = new Array<String>();
    data.push(action);
    data.push(value)
    this.updateParent.emit(data)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log("unsubscribe");
  }

}
