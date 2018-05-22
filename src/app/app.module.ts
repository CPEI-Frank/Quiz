import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CookieModule} from 'ngx-cookie';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoadingModule} from 'ngx-loading';
import {ToastModule} from 'ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FilterPipe} from './pipes/filter.pipe';
import {SortByPipe} from './pipes/sort-by.pipe';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {QuizListComponent} from './components/quiz-list/quiz-list.component';
import {QuizEditorComponent} from './components/quiz-editor/quiz-editor.component';
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {QuestionFillerComponent} from './components/question-filler/question-filler.component';
import {PassTestComponent} from './components/pass-test/pass-test.component';

import {TestService} from './services/test.service';
import {AppConfig} from './app.config';
import {ToastsManager} from 'ng2-toastr';
import {ShowToastrService} from './services/show-toastr.service';
import {QuizFormService} from './services/quiz-form.service';
import {routes} from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    QuizListComponent,
    QuizEditorComponent,
    NotFoundPageComponent,
    QuestionFillerComponent,
    PassTestComponent,
    FilterPipe,
    SortByPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    CookieModule.forRoot(),
    NgbModule.forRoot(),
    LoadingModule,
    ToastModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    AppConfig,
    TestService,
    ToastsManager,
    ShowToastrService,
    QuizFormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
