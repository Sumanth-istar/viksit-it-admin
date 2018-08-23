import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../managerService/manager.service';

@Component({
  selector: 'app-manager-hierarchy',
  templateUrl: './manager-hierarchy.component.html',
  styleUrls: ['./manager-hierarchy.component.css']
})
export class ManagerHierarchyComponent implements OnInit {

  complex_object
  isActiveLink = 'manager'
  currentIndex = 0;
  showHide = true;
  isExist = false;
  organizationID
  managers = []
  targetItems = []
  associates = []
  isCollapsedM = true;
  isCollapsedR = true;

  constructor(private managerService: ManagerService) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.organizationID = this.complex_object.studentProfile.org_details[0].id

    this.getManagerHierarchy();

  }

  getManagerHierarchy() {

    this.managerService.getManagerHierarchy(this.organizationID)
      .subscribe(data => {

        console.log(data['data']);

        this.targetItems = data['data'].targetArray;
        this.managers = data['data'].sourceManagerArray;
        this.associates = data['data'].sourceReporteesArray

      }, (err) => {
        console.log('error', err);

      });


  }

  isCollapsed(i, action) {
    this.currentIndex = i;
    if (action == 'show') {
      this.showHide = true;
    } else if (action == 'close') {
      this.showHide = false;
    }
  }

  public checkUserExists(event, index) {
    console.log(event);
    console.log(index);

    for (let i in this.targetItems[index].children)
      if (event.value.id == this.targetItems[index].children[i].id) {

        this.targetItems[index].children.splice(i, 1);
        console.log(this.targetItems);

        setTimeout(() => {
          alert("User already Assigned to this Manager");
        }, 500);

      }
  }

  removeUser(managerIndex, reporteeIndex) {
    this.targetItems[managerIndex].children.splice(reporteeIndex, 1);
  }

  onSubmit() {
    console.log(this.targetItems);
    this.managerService.saveManagerHierarchy(this.targetItems, this.organizationID).subscribe(
      // Successful responses call the first callback.
      data => {
        console.log(data['data']);
        this.targetItems = data['data'].targetArray;
        this.managers = data['data'].sourceManagerArray;
        this.associates = data['data'].sourceReporteesArray

      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');
      });


  }
}
