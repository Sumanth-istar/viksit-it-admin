import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AuthService } from '../../login/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input() userProfile;
  @Input() isActiveLink;
  isNavbarCollapsed = true;
  logoutString: String;
  profilePic: string;
  complex_object;
  username: string;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.username = this.userProfile.name;
    this.profilePic = this.userProfile.profileImage;

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['isActiveLink']) {

    }
  }
  public navBarLinks(action) {

    this.isActiveLink = action;

    switch (action) {
      case 'logout':
        this.auth.logout();
        this.router.navigate(['/app-login'], { relativeTo: this.route });
        break;
      case 'dashboard':
        this.router.navigate(['/app-dashboard'], { relativeTo: this.route });
        break;
      case 'users':
        this.router.navigate(['/app-users'], { relativeTo: this.route });
        break;
      case 'groups':
        this.router.navigate(['/app-groups'], { relativeTo: this.route });
        break;
      case 'manager':
        this.router.navigate(['/app-manager-hierarchy'], { relativeTo: this.route });
        break;
      case 'licenses':
        this.router.navigate(['/app-licenses'], { relativeTo: this.route });
        break;


    }




  }

}