import { Component, OnInit, ViewChild } from '@angular/core';
import { ManagerService } from '../managerService/manager.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

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
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild('loginerrorSwal') private loginerrorSwal: SwalComponent;

  constructor(private managerService: ManagerService, private spinner: NgxSpinnerService) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.organizationID = this.complex_object.studentProfile.org_details[0].id

    this.getManagerHierarchy();

  }

  getManagerHierarchy() {

    this.managerService.getManagerHierarchy(this.organizationID).takeUntil(this.ngUnsubscribe)
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
          // alert("User already Assigned to this Manager");
          this.loginerrorSwal.show();
        }, 900);

      }
  }

  removeUser(managerIndex, reporteeIndex) {
    this.targetItems[managerIndex].children.splice(reporteeIndex, 1);
  }

  onSubmit() {
    console.log(this.targetItems);
    this.spinner.show();
    this.managerService.saveManagerHierarchy(this.targetItems, this.organizationID).takeUntil(this.ngUnsubscribe).subscribe(
      // Successful responses call the first callback.
      data => {
        console.log(data['data']);
        this.targetItems = data['data'].targetArray;
        this.managers = data['data'].sourceManagerArray;
        this.associates = data['data'].sourceReporteesArray
        this.spinner.hide();
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');
        this.spinner.hide();
      });


  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    console.log("unsubscribe");
  }

}
