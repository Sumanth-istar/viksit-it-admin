import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../../config/app.config';
import { Md5 } from 'ts-md5/dist/md5';

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

  public resetUserPassword(Id, password) {

    let md5Password = Md5.hashStr(password);

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/reset_password/' + Id + '/' + md5Password, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


  public bulkUpload(file: File, groupId, licenseId, orgId) {

    console.log(file);
    let user_object = {
      org_id: orgId,
      licenses: licenseId,
      groups: groupId
    }

    var body = new FormData(document.forms[0]);
    body.append("file", file, file.name);
    body.append("user_object", JSON.stringify(user_object));
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/user_bulk_upload', body, {
      headers: headers,
    });
  }

  public bulkUploadCheck(event) {

    const files: Array<File> = event.target.files;

    var body = new FormData(document.forms[0]);
    body.append("file", files[0], files[0]['name']);
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.set('Accept', 'application/json');
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/user_bulk_upload_check', body, {
      headers: headers,
    });
  }


  public createUser(orgId, user_object) {

    const body = new HttpParams()
      .set('user_object', JSON.stringify(user_object));
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/create/' + orgId, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public updateUser(userId, orgId, user_object) {

    const body = new HttpParams()
      .set('user_object', JSON.stringify(user_object));
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/update/' + userId + '/' + orgId, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

  public suspendUser(user_ids) {

    const body = new HttpParams()
      .set('user_ids', JSON.stringify(user_ids));
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'user/suspend/', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


}

