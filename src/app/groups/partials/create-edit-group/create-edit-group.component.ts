import { Component, OnInit, EventEmitter } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UserService } from '../../../users/userservice/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-edit-group',
  templateUrl: './create-edit-group.component.html',
  styleUrls: ['./create-edit-group.component.css']
})
export class CreateEditGroupComponent implements OnInit {

  complex_object
  isActiveLink = 'groups'
  orgID
  groupTypsData = ["UNIT",
    "PRODUCT",
    "SALES_TEAM",
    "SECTION",
    "JOB_ROLE",
    "DEPARTMENT"];
  skillSearch = new EventEmitter<string>();
  skillData = [];
  form: FormGroup;
  isSkillFound = false;
  constructor(private userService: UserService) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.orgID = this.complex_object.studentProfile.org_details[0].id;



    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      groupType: new FormControl(null, [Validators.required]),
      students: new FormControl(null),
      skills: new FormControl(null),

    });
    this.skillSearchFilter();

  }


  skillSearchFilter() {

    this.isSkillFound = false;

    this.skillSearch
      .pipe(
        debounceTime(2000),
        switchMap(term => this.userService.getSkillDetails(term, this.orgID))
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

}
