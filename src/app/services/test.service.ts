import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../app.config';
import {Observable} from 'rxjs/Observable';
import {ITest} from '../shared/Test';
import {IQuestion} from '../shared/Question';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IAnswer} from '../shared/Answer';

@Injectable()
export class TestService {
  private searchSource = new BehaviorSubject<string>('');
  currentMessage = this.searchSource.asObservable();

  constructor(private _http: HttpClient,
              private _config: AppConfig) {}

  changeSearch(message: string) {
    this.searchSource.next(message);
  }

  getAllTests(): Observable<any> {
    return this._http.get(this._config.API_URLS.test);
  }

  getTestById(testId: number): Promise<any> {
    return this._http.get(`${this._config.API_URLS.test}/${testId}`).toPromise();
  }

  deleteTest(testId: number): Observable<any> {
    return this._http.delete(`${this._config.API_URLS.test}/${testId}`);
  }

  editTest(body: ITest, testId: number): Observable<any> {
    return this._http.put(`${this._config.API_URLS.test}/${testId}`, JSON.stringify(body), this._config.getHeaders());
  }

  createTest(body: ITest): Observable<any> {
    return this._http.post(`${this._config.API_URLS.test}`, JSON.stringify(body), this._config.getHeaders());
  }

  passTest(body): Promise<any> {
    return this._http.post(`${this._config.API_URLS.passTest}`, JSON.stringify(body), this._config.getHeaders()).toPromise();
  }

  getAllQuestions(): Promise<any> {
    return this._http.get(`${this._config.API_URLS.question}`).toPromise();
  }

  getQuestionById(questionId): Promise<any> {
    return this._http.get(`${this._config.API_URLS.question}/${questionId}`).toPromise();
  }

  createQuestion(body): Observable<any> {
    return this._http.post(`${this._config.API_URLS.question}`, JSON.stringify(body), this._config.getHeaders());
  }

  deleteQuestion(questionId: number) {
    return this._http.delete(`${this._config.API_URLS.question}/${questionId}`);
  }

  editQuestion(body, questionId) {
    return this._http.put(`${this._config.API_URLS.question}/${questionId}`, JSON.stringify(body), this._config.getHeaders());
  }

  addQuestionsToTest(body) {
    return this._http.post(`${this._config.API_URLS.addQuestions}`, JSON.stringify(body), this._config.getHeaders());
  }

  deleteAnswer(answerId: number) {
    return this._http.delete(`${this._config.API_URLS.answer}/${answerId}`);
  }

  editAnswer(body: IAnswer) {
    return this._http.put(`${this._config.API_URLS.answer}`, JSON.stringify(body), this._config.getHeaders());
  }
}
