import { Injectable } from '@angular/core';
import { AppConfiguration } from '../../config/app.config';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {

  constructor(private http: HttpClient) { }


  public getLicenses(params, counter, orgId, searchText) {

    let sort = 'asc';
    let sortBy = 'name'
    if (params.sortAsc != null && params.sortAsc) {
      sort = 'asc'
    }
    if (params.sortBy != null) {
      sortBy = params.sortBy
    }


    const body = new HttpParams()
      .set('start', params.offset)
      .set('length', params.limit)
      .set('draw', counter.toString())
      .set('search[value]', searchText)
      .set('order[0][dir]', sort)
      .set('order[0][column]', sortBy)
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'it_admin/all_licenses_for_it_admin/' + orgId, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }



}
