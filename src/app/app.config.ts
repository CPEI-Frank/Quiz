import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class AppConfig {
  public readonly url_server = 'http://localhost:8181/';

  private readonly _API_URLS = {
    test: `${this.url_server}test`,
    question: `${this.url_server}question`,
    answer: `${this.url_server}answer`,
    addQuestions: `${this.url_server}test/addQuestionsToTheTestByTestAndQuestionIds`,
    passTest: `${this.url_server}test/passTest`
  };

  constructor(private _cookieService: CookieService) {}

  get API_URLS() {
    return this._API_URLS;
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
  }

  getToken() {
    if (this._cookieService.get('token')) {
      return this._cookieService.get('token');
    } else {
      return localStorage.getItem('token');
    }
  }
}
