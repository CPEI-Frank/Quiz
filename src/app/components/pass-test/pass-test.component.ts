import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {TestService} from '../../services/test.service';
import {ShowToastrService} from '../../services/show-toastr.service';

@Component({
  selector: 'app-pass-test',
  templateUrl: './pass-test.component.html',
  styleUrls: ['./pass-test.component.scss']
})
export class PassTestComponent implements OnInit {
  public selectedTestId: number;
  public loading = false;
  public subscription: Subscription;
  public currentQuestion;
  public step = 0;
  public selectedAnswerId: number;
  public body;
  public score: number = null;
  private _questions = [];

  get questions() {
    return this._questions;
  }
  set questions(value) {
    this._questions = value;
  }

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _testService: TestService,
              private _toastr: ShowToastrService) {
    this.subscription = this._activatedRoute.params.subscribe(params => {
      this.selectedTestId = +params['id'];
    });
  }

  async ngOnInit() {
    if (this.selectedTestId) {
      this.loading = true;
      try {
        this.questions = (await this._testService.getTestById(this.selectedTestId)).questionList;

        for (const question of this.questions) {
          delete question.questionId;
          delete question.testId;
        }

        this.currentQuestion = this.questions[this.step];
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
        this._toastr.showError('Помилка отримання тесту!');
        this.goToTestsList();
      }
    } else {
      this._toastr.showError('Неправильний запит!');
      this.goToTestsList();
    }

    this.body = {
      'questionList': this.questions,
      'testId': this.selectedTestId
    };
  }

  nextQuestion(e) {
    e.preventDefault();

    for (const answer of this.currentQuestion.answerList) {
      answer.true = answer.answerId === this.selectedAnswerId;
      delete answer.answerId;
    }

    if (this.questions.length - this.step !== 1) {
      this.currentQuestion = this.questions[++this.step];
    } else {
      this.passTest();
    }
  }

  passTest() {
    this.loading = true;
    this._testService.passTest(this.body)
      .then(
        result => {
          this.score = result['totalScore'];
          this.currentQuestion = null;
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
          this._toastr.showError('Помилка отримання результатів тесту. Спробуйте пройти пізніше.');
          this.goToTestsList();
        });
  }

  goToTestsList() {
    this._router.navigate(['../tests-list']);
  }
}
