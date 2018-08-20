import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class GroupserviceService {

  constructor(private http: HttpClient) { }

  public getAllGroups(orgId) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'group/all/' + orgId, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getGroupDetails(groupId) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'group/details/' + groupId, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getEditGroupDetails(groupId) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'group/edit/' + groupId, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


  public getJobDescriptionDetails(skills, orgId) {

    const body = new HttpParams()
      .set('skill_object', JSON.stringify(skills));
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'group/skills/' + orgId, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }
}