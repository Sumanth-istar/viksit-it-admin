import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  complex_object
  isActiveLink = 'dashboard';
  currentOrientation = 'vertical';
  isCollapsed1 = true;
  isCollapsed2 = false;
  index = 1;
  constructor() { }

  ngOnInit() {

    const local_complex_object = localStorage.getItem('currentUser')
    this.complex_object = JSON.parse(local_complex_object);

  }

  isCollapsed(value) {
    if (value === 'isCollapsed1') {
      this.isCollapsed2 = false;
      this.isCollapsed1 = true;
      this.index = 1;
    } else if (value === 'isCollapsed2') {
      this.isCollapsed1 = false;
      this.isCollapsed2 = true;
      this.index = 2;
    }

  }

}
