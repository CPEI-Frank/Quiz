import {Routes} from '@angular/router';
import {QuizListComponent} from './components/quiz-list/quiz-list.component';
import {QuizEditorComponent} from './components/quiz-editor/quiz-editor.component';
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {PassTestComponent} from './components/pass-test/pass-test.component';
import {QuestionFillerComponent} from './components/question-filler/question-filler.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tests-list',
    pathMatch: 'full'
  },
  {
    path: 'tests-list',
    component: QuizListComponent
  },
  {
    path: 'quiz-creator',
    component: QuizEditorComponent
  },
  {
    path: 'quiz-editor/:id',
    component: QuizEditorComponent
  },
  {
    path: 'question-editor/:id',
    component: QuestionFillerComponent
  },
  {
    path: 'pass-test/:id',
    component: PassTestComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];
