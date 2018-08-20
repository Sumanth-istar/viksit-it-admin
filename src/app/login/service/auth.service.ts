import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppConfiguration } from '../../config/app.config';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public tasks = new BehaviorSubject<Object>(null);
  updatedTask = this.tasks.asObservable();
  constructor(private http: HttpClient) { }

  public authenticate(email, password) {

    let md5Password = Md5.hashStr(password);

    const body = new HttpParams()
      .set('email', email)
      .set('password', md5Password.toString());
    return this.http.post(AppConfiguration.ServerWithApiUrl + 'auth/login', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }
  public login(data) {
    this.tasks.next(data.tasks);
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(data));
  }

  logout() {
    sessionStorage.removeItem('course');
    sessionStorage.removeItem('lesson');
    localStorage.removeItem('currentUser');
  }


  public getComplexForUpdateTask(id) {

    return this.http.get(AppConfiguration.ServerWithApiUrl + 'user/' + id + '/complex', {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }

}

