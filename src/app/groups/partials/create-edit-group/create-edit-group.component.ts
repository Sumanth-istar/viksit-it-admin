import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UserService } from '../../../users/userservice/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupserviceService } from '../../groupService/groupservice.service';
import { Group } from '../../../core/pojo/group';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-create-edit-group',
  templateUrl: './create-edit-group.component.html',
  styleUrls: ['./create-edit-group.component.css']
})
export class CreateEditGroupComponent implements OnInit {

  complex_object
  @ViewChild('success_and_warning_errorSwal') private success_and_warning_errorSwal: SwalComponent;
  alertTitle = "Oops...";
  alertMessage = "Something went wrong!";
  alertType = "error";
  isActiveLink = 'groups'
  orgID
  skillerrorMessage;
  groupTypsData = ["UNIT",
    "PRODUCT",
    "SALES_TEAM",
    "SECTION",
    "JOB_ROLE",
    "DEPARTMENT"];
  skillSearch = new EventEmitter<string>();
  skillData = [];
  skillList = [];
  tempSkillList = [];
  currentModalInstance: any;
  jobDecList = [];
  job_description = "";
  groupDetail;
  submitBtnText = "Create"
  group: Group;
  form: FormGroup;
  isSkillFound = false;
  isJobDescriptionFound = false;
  public groupIds: string;
  public formErrors = {
    name: '',
    groupType: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private groupService: GroupserviceService, private modalService: NgbModal) {
    this.groupIds = this.route.snapshot.params.id;
  }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.orgID = this.complex_object.studentProfile.org_details[0].id;

    this.group = new Group();
    this.setupGroupForm();
    if (this.groupIds != null && this.groupIds != 'null') {

      this.groupService.getEditGroupDetails(this.groupIds.toString()).subscribe(
        data => {
          this.group = data['data'];
          console.log(this.group);
          this.setupGroupForm();
          this.skillList = this.group.skills;
          this.submitBtnText = "Update";
        },
        err => {

          console.log('Something went wrong!');

        }
      );

    }

    this.skillSearchFilter();



  }

  open(content) {

    if (this.job_description) {
      this.isJobDescriptionFound = false;
      this.currentModalInstance = this.modalService.open(content, { size: 'lg' });
      console.log(this.job_description);
      let skills = { skills: this.job_description }
      this.groupService.getJobDescriptionDetails(skills, this.orgID)
        .subscribe(data => {

          console.log(data['data']);
          this.jobDecList = [];
          this.jobDecList = data['data']


          if (this.jobDecList[0].message) {
            this.skillerrorMessage = this.jobDecList[0].message;
            this.jobDecList = [];
          }
        }, (err) => {
          console.log('error', err);
          this.jobDecList = [];
          this.skillerrorMessage = 'Something went wrong!';
        });





    } else {
      this.isJobDescriptionFound = true;
    }

  }

  setupGroupForm() {

    this.form = new FormGroup({
      name: new FormControl(this.group.name, [Validators.required]),
      groupType: new FormControl(this.group.type, [Validators.required]),
      students: new FormControl(this.group.max_student),
      skills: new FormControl(null),
    });

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

  AddSkills() {
    console.log(this.form.value.skills);
    if (this.form.value.skills != null) {
      this.skillList.push(this.form.value.skills)

    }

  }

  skillSelected(skill) {
    this.tempSkillList.push(skill);
  }

  updateSkill() {
    for (let skill of this.tempSkillList) {
      this.skillList.push(skill)
    }
    this.currentModalInstance.close();
  }

  onSubmit() {

    console.log(this.form);

    let group_object = {
      name: this.form.get('name').value,
      type: this.form.get('groupType').value,
      maxStudent: this.form.get('students').value,
      skills: this.skillList
    }

    console.log(group_object);

    if (this.groupIds != null && this.groupIds != 'null') {

      this.groupService.updateGroup(this.groupIds, group_object).subscribe(
        data => {
          console.log(data);
          if (data.status == 200) {
            this.success_and_warning_errorSwal.type = "success";
            this.success_and_warning_errorSwal.title = "SUCCESS"
            this.success_and_warning_errorSwal.text = data.body['message'];
            this.success_and_warning_errorSwal.show();
            this.router.navigate(['/app-create-edit-group/' + this.groupIds.toString()], { relativeTo: this.route });
          } else {
            this.success_and_warning_errorSwal.type = "error";
            this.success_and_warning_errorSwal.title = "ERROR"
            this.success_and_warning_errorSwal.text = data.body['message'];
            this.success_and_warning_errorSwal.show();
          }

        },
        err => {
          console.log('Something went wrong!');
          this.success_and_warning_errorSwal.type = "error";
          this.success_and_warning_errorSwal.title = "ERROR"
          this.success_and_warning_errorSwal.text = "Something went wrong!";
          this.success_and_warning_errorSwal.show();
        }
      );



    } else {

      this.groupService.createGroup(this.orgID, group_object).subscribe(
        data => {
          console.log(data);

          if (data.status == 200) {
            this.success_and_warning_errorSwal.type = "success";
            this.success_and_warning_errorSwal.title = "SUCCESS"
            this.success_and_warning_errorSwal.text = data.body['message'];
            this.success_and_warning_errorSwal.show();
            this.router.navigate(['/app-groups'], { relativeTo: this.route });
          } else {
            this.success_and_warning_errorSwal.type = "error";
            this.success_and_warning_errorSwal.title = "ERROR"
            this.success_and_warning_errorSwal.text = data.body['message'];
            this.success_and_warning_errorSwal.show();
          }


        },
        err => {
          console.log('Something went wrong!');
          this.success_and_warning_errorSwal.type = "error";
          this.success_and_warning_errorSwal.title = "ERROR"
          this.success_and_warning_errorSwal.text = "Something went wrong!";
          this.success_and_warning_errorSwal.show();
        }
      );

    }



  }

}
