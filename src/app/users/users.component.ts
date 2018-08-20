import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableResource, DataTable } from 'angular5-data-table';
import { UserService } from './userservice/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../core/pojo/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  complex_object
  isActiveLink = 'users'
  itemResource = new DataTableResource([]);
  items = [];
  itemCount = 0;
  @ViewChild(DataTable) userTable: DataTable;
  counter = 1;
  orgID;
  modalHeader
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
  public options: Select2Options;
  closeResult: string;
  isCreateEditUserModal = false;
  isBulkUserModal = false;
  createUserFormData
  user: User = new User();
  isvalidModal;
  limits = [10];

  constructor(private userservice: UserService, private modalService: NgbModal) {

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


  }
  open(content, value) {


    if (value === 'user') {
      this.modalHeader = "ADD NEW USER";
    } else if (value === 'bulkupload') {
      this.modalHeader = "BULK UPLOAD";
    } else if (value === 'changepassword') {
      this.modalHeader = "CHANGE PASSWORD";
    }

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
    this.modalHeader = "EDIT USER";
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
    this.modalHeader = "CHANGE PASSWORD";
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


}
