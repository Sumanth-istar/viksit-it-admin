import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableResource, DataTable } from 'angular5-data-table';
import { LicenseService } from '../licensesService/license.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.css']
})
export class LicensesComponent implements OnInit {

  @ViewChild(DataTable) userTable: DataTable;
  complex_object
  isActiveLink = 'licenses'
  itemResource = new DataTableResource([]);
  items = [];
  itemCount = 0;
  counter = 1;
  limits = [10];
  orgID;
  public searchText: string = "";

  constructor(private licenseService: LicenseService, private modalService: NgbModal) { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);
    this.orgID = this.complex_object.studentProfile.org_details[0].id
  }

  open(content) {

    this.modalService.open(content, { size: 'lg' });
  }



  reloadItems(params) {

    this.licenseService.getLicenses(params, this.counter, this.orgID, this.searchText).subscribe(
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

}
