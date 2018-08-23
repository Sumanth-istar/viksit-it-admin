import { Injectable } from '@angular/core';
import { AppConfiguration } from '../../config/app.config';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {


  constructor(private http: HttpClient) { }



  public getManagerHierarchy(orgId) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'it_admin/hierarchydetails/' + orgId, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


  public saveManagerHierarchy(targetItems, orgId) {

    const body = new HttpParams()
      .set('user_object', JSON.stringify(targetItems));
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'it_admin/save_hierarchydetails/' + orgId, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


}
