import {Component, OnInit} from '@angular/core';
import {TestService} from '../../services/test.service';
import {ITest} from '../../shared/Test';
import {ShowToastrService} from '../../services/show-toastr.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {
  private _tests: ITest[] = [];
  public loading = false;
  public term: string;

  get tests() {
    return this._tests;
  }
  set tests(value: ITest[]) {
    this._tests = value;
  }

  constructor(private _testService: TestService,
              private _toastr: ShowToastrService,
              private _router: Router) {
  }

  ngOnInit() {
    this.getAllTests();
    this._testService.currentMessage.subscribe(term => this.term = term);
  }

  getAllTests() {
    this.loading = true;
    this._testService.getAllTests()
      .subscribe((res: ITest[]) => {
        if (res[0]) {
          this.tests = res;
          this.loading = false;
        } else {
          this.loading = false;
          this._toastr.showWarning('Ви не створили ще жодного тесту. Створіть новий зараз!');
        }
      }, error => {
        this.loading = false;
        this._toastr.showError('Помилка завантаження тестів!');
        console.log(error);
      });
  }

  async editQuestion(testId) {
    const questions = (await this._testService.getTestById(testId)).questionList;
    const obj = {};

    questions.forEach(question => {
      obj[question.questionId] = question.description;
    });

    const questionId: number = await this._toastr.editQuestionNotify(obj);
    if (questionId) {
      this._router.navigate(['question-editor', questionId]);
    }
  }

  async deleteTest(test: ITest) {
    const result = await this._toastr.delNotify(`Ви дійсно бажаєте видалити тест "${test.title}" ?`,
      'question', 5000);
    if (result) {
      this.loading = true;
      this._testService.deleteTest(test.testId)
        .subscribe(
          () => {
            this.tests.splice(this.tests.indexOf(test), 1);
            this.loading = false;
            this._toastr.showSuccess('Тест видалено успішно!');
            if (!this.tests[0]) {
              this._toastr.showWarning('Тепер Ваш список тестів пустий. Створіть новий тест зараз!');
            }
          },
          error => {
            console.log(error);
            this.loading = false;
            this._toastr.showError('Помилка видалення тесту');
          }
        );
    }
  }

  async passTestNotify(test: ITest) {
    const questionLength = (await this._testService.getTestById(test.testId)).questionList.length;

    if (questionLength < 2) {
      this._toastr.showWarning('Тест неможливо пройти, оскільки в ньому менше двох питань!');
      return;
    }

    const result = await this._toastr.passTestNotify(`Бажаєте пройти тест "${test.title}"?`,
      'question', 5000);

    if (result) {
      this._router.navigate(['../pass-test', test.testId]);
    }
  }

  onStopPropagation(event: Event) {
    event.stopPropagation();
  }
}
