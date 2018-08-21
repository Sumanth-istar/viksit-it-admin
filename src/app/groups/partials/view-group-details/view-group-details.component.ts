import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableResource, DataTable } from 'angular5-data-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../core/pojo/user';
import { UserService } from '../../../users/userservice/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupserviceService } from '../../groupService/groupservice.service';

@Component({
  selector: 'app-view-group-details',
  templateUrl: './view-group-details.component.html',
  styleUrls: ['./view-group-details.component.css']
})
export class ViewGroupDetailsComponent implements OnInit {

  complex_object
  isActiveLink = 'groups'
  itemResource = new DataTableResource([]);
  items = [];
  itemCount = 0;
  @ViewChild(DataTable) userTable: DataTable;
  counter = 1;
  orgID;
  groupDetail
  public groupData = [];
  public moreData = [{
    id: '0',
    name: 'More'
  },
  {
    id: '1',
    name: 'Suspend'
  }];
  public licenseData = [];
  public groupIds: string;
  public licenseIds: string;
  public searchText: string = "";
  closeResult: string;
  isCreateEditUserModal = false;
  isBulkUserModal = false;
  createUserFormData
  user: User = new User();
  isvalidModal;
  constructor(private router: Router, private route: ActivatedRoute, private userservice: UserService, private modalService: NgbModal, private groupService: GroupserviceService) {
    this.groupIds = this.route.snapshot.params.id;
  }


  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.orgID = this.complex_object.studentProfile.org_details[0].id
    this.getUserCreationFormFields();

    this.user.id = null;
    this.user.name = null;
    this.user.email = null;
    this.user.mobile = null;
    this.user.address_line_1 = null;
    this.user.address_line_2 = null;
    this.user.city = null;
    this.user.groups = null;
    this.user.job_roles = null;
    this.user.licenses = null;
    this.user.orgnizations = null;
    this.user.pincode = null;
    this.user.units = null;
    this.user.user_roles = null;
    this.user.state = null;


    this.groupService.getGroupDetails(this.groupIds.toString()).subscribe(
      data => {

        this.groupDetail = data['data'];
      },
      err => {

        console.log('Something went wrong!');

      }
    );


  }
  open(content, value) {

    this.isvalidModal = value;
    this.user = new User();

    this.modalService.open(content, { size: 'lg' });
  }

  reloadItems(params) {

    this.userservice.getUsers(params, this.counter, this.orgID, this.groupIds, this.licenseIds, this.searchText).subscribe(
      // Successful responses call the first callback.
      data => {
        //   console.log(data['data'])
        if (data['draw'] == 1) {
          this.itemResource = new DataTableResource(data['data']);
          this.itemResource.query(params).then(items => this.items = items);
        } else {
          this.items = data['data'];
        }
        this.itemCount = data['recordsFiltered'];
        this.counter++;
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');
      }
    );

  }


  groupFilter() {

    this.reloadItems({ offset: 0, limit: 10 })
  }

  licenseFilter() {

    this.reloadItems({ offset: 0, limit: 10 })
  }

  searchTextFunction(searchValue: string) {
    this.searchText = searchValue;
    this.reloadItems({ offset: 0, limit: 10 })
  }
  getUserCreationFormFields() {

    this.userservice.getNewUserCreationFormFields(this.orgID).subscribe(
      data => {

        console.log(data['data']);
        this.createUserFormData = data['data']
        this.licenseData = this.createUserFormData.licenceForFilter;
        this.groupData = this.createUserFormData.groupsForFilter;
      },
      err => {

        console.log('Something went wrong!');

      }
    );

  }

  editUser(content, usrId, value) {
    this.isvalidModal = value;
    console.log(usrId);
    this.userservice.getUserDetails(usrId).subscribe(
      // Successful responses call the first callback.
      data => {
        this.user = data['data'];
        console.log(this.user);
        this.modalService.open(content, { size: 'lg' });
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');
      }
    );
  }


  changePassword(content, usrId, value) {
    this.isvalidModal = value;
    console.log(usrId);
    this.userservice.getUserDetails(usrId).subscribe(
      // Successful responses call the first callback.
      data => {
        this.user = data['data'];
        console.log(this.user);
        this.modalService.open(content, { size: 'lg' });
      },
      // Errors will call this callback instead:
      err => {
        console.log('Something went wrong!');
      }
    );
  }


  goBack() {

    this.router.navigate(['/app-groups'], { relativeTo: this.route });

  }

  editGroup() {
    this.router.navigate(['/app-create-edit-group/' + this.groupIds.toString()], { relativeTo: this.route });
  }
}
