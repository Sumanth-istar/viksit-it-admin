import { Component, OnInit } from '@angular/core';
import { GroupserviceService } from './groupService/groupservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  complex_object
  isActiveLink = 'groups'
  orgID
  groups = []
  groupsData = []
  groupsType = [];
  groupData = [];
  groupType
  groupIds
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupserviceService) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.orgID = this.complex_object.studentProfile.org_details[0].id


    this.groupService.getAllGroups(this.orgID).takeUntil(this.ngUnsubscribe).subscribe(
      data => {

        //    console.log(data['data']);
        this.groups = data['data'];
        this.groupsData = data['data'];
        let types = []
        let groupName = []
        for (let group of this.groups) {

          if (types.includes(group.group_type)) {
          } else {
            types.push(group.group_type);
          }
          groupName.push(group.name);

        }
        this.groupsType = types;
        this.groupData = groupName;

      },
      err => {

        console.log('Something went wrong!');

      }
    );



  }
  groupFilter() {

    console.log(this.groupIds);
    if (this.groupIds.length != 0) {
      this.groups = this.groupsData.filter((item: any) => this.groupIds.includes(item.name));
    } else {
      this.groups = this.groupsData
    }

  }
  groupTypesFilter() {
    console.log(this.groupType);
    if (this.groupType.length != 0) {
      this.groups = this.groupsData.filter((item: any) => this.groupType.includes(item.group_type));
    } else {
      this.groups = this.groupsData
    }

  }


  goToGroupDetail(id) {
    console.log(id)
    this.router.navigate(['/app-view-group-details/' + id], { relativeTo: this.route });

  }

  createGroup() {
    this.router.navigate(['/app-create-edit-group/' + null], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log("unsubscribe");
  }

}
