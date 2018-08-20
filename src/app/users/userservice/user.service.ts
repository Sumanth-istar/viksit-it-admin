import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUsers(params, counter, orgId, groupIds, licenseIds, searchText) {

    let sort = 'asc';
    let sortBy = 'name'
    if (params.sortAsc != null && params.sortAsc) {
      sort = 'asc'
    }
    if (params.sortBy != null) {
      sortBy = params.sortBy
    }
    if (groupIds == undefined || groupIds == null || groupIds.length == 0) {
      groupIds = '';
    } else {
      groupIds = groupIds.toString();
    }
    if (licenseIds == undefined || licenseIds == null || licenseIds.length == 0) {
      licenseIds = '';
    } else {
      licenseIds = licenseIds.toString();
    }

    const body = new HttpParams()
      .set('start', params.offset)
      .set('length', params.limit)
      .set('groupsId', '')
      .set('draw', counter.toString())
      .set('search[value]', searchText)
      .set('order[0][dir]', sort)
      .set('order[0][column]', sortBy)
      .set('licenseId', licenseIds)
      .set('groupsId', groupIds);
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/all_user_of_it_admin/' + orgId, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


  public getNewUserCreationFormFields(orgId) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/create/' + orgId, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getUserExist(email) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/validate/email/' + email, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getMobileExist(mobile) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/validate/mobile/' + mobile, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getPinCodeExist(pin) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'organization/search/pincode?q=' + pin, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getUserDetails(Id) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/edit/' + Id, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getSkillDetails(skillName, orgId) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'group/skills/' + skillName + '/' + orgId, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }




  public saveUserSkill(skills, userId) {

    console.log(skills);

    const body = new HttpParams()
      .set('user_object', JSON.stringify(skills));
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/save_user_skill/' + userId, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public getUserSkill(Id) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/get_user_skill/' + Id, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


  public getUserProfile(Id) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/' + Id + '/complex', {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


  public bulkUpload(fileString, fileFormat) {

    console.log(fileString);
    // console.log(fileString);
    var body = new HttpParams()
      .set("fileFormat", fileFormat)
      .set("fileString", fileString);

    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/bulk_upload_check', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


}

