import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../userservice/user.service';

@Component({
  selector: 'app-bulkuploadmodal',
  templateUrl: './bulkuploadmodal.component.html',
  styleUrls: ['./bulkuploadmodal.component.css']
})
export class BulkuploadmodalComponent implements OnInit {

  licenseData = [];
  groupData = [];
  @Input() createUserFormData;

  constructor(private userService: UserService) { }

  ngOnInit() {

    this.licenseData = this.createUserFormData.licenses
    this.groupData = this.createUserFormData.groups;
  }

  fileUpload(event) {

    console.log(event);
    if (event.target.files[0].name.split('.')[1]) {

      let reader = new FileReader();
      let fileFormat;
      let fileString;
      reader.onload = (e) => {
        // you can perform an action with readed data here
        // console.log(reader.result);
        fileString = reader.result.split(',')[1];
        fileFormat = event.target.files[0].name.split('.')[1]
        this.userService.bulkUpload(fileString, fileFormat).subscribe(
          data => {
            console.log(data);
          },
          err => {
            console.log('Something went wrong!');
          }
        );

      }
      reader.readAsDataURL(event.target.files[0]);



    } else {
      alert('Invalid file.')
    }


  }

}
