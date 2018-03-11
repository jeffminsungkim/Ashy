import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageServiceProvider } from '@ashy/services/local-storage-service/local-storage-service';
import { Observable } from 'rxjs/Observable';


export abstract class RestService {

  protected _baseUrl: string;
  protected _token: string;

  constructor(protected http: HttpClient, protected localStorage: LocalStorageServiceProvider) {}

  protected set baseUrl(url: string) { this._baseUrl = url; }

  protected set token(token: string) { this._token = token; }

  protected get baseUrl(): string { return this._baseUrl; }

  protected get token(): string { return this._token; }

  protected get headers(): HttpHeaders {
     return new HttpHeaders({'Authorization': this.token, 'Content-Type': 'application/json; charset=utf-8'});
  }

  protected post(relativeUrl: string, data: any): Observable<any> {
    const url = this.baseUrl + relativeUrl;
    return this.http.post(url, JSON.stringify(data), { headers: this.headers });
  }
}
