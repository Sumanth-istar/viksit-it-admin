import { Injectable } from '@angular/core';

@Injectable()
export class AppConfiguration {
    public static Server = 'http://localhost:8080/';
    public static ApiUrl = 'istar/rest/';
    public static ServerWithApiUrl = AppConfiguration.Server + AppConfiguration.ApiUrl;
}