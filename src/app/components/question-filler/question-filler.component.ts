import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TestService} from '../../services/test.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ShowToastrService} from '../../services/show-toastr.service';
import {Subscription} from 'rxjs/Subscription';
import {IAnswer} from '../../shared/Answer';
import {IQuestion} from '../../shared/Question';

@Component({
  selector: 'app-question-filler',
  templateUrl: './question-filler.component.html',
  styleUrls: ['./question-filler.component.scss']
})
export class QuestionFillerComponent implements OnInit {
  questionForm: FormGroup;
  @Input() createdQuizId: number;
  @Input() passedQuizId: number;
  public loading = false;
  public subscription: Subscription;
  public createdQuestions: number[] = [];
  public answerIsSelected = false;
  public questionIdForEdit: number;

  public questionTitle: string;
  public answersArray: IAnswer[] = [];

  public validationMessages = {
    'questionTitle': {
      'required': 'Обов\'язкове поле.',
      'minlength': 'Мінімальна кількість символів 5. ',
      'maxlength': 'Максимальна кількість символів 200.',
    },
    'answerTitle': {
      'required': 'Обов\'язкове поле.',
      'maxlength': 'Максимальна кількість символів 200.',
    }
  };

  constructor(private _formBuilder: FormBuilder,
              private _testService: TestService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _toastr: ShowToastrService) {
    this.subscription = this._activatedRoute.params.subscribe(param => {
      this.questionIdForEdit = +param['id'];
    });
  }

  async ngOnInit() {
    this.buildForm();
    if (this.questionIdForEdit) {
      await this.getQuestionById();
      this.initQuestionValues();
    } else {
      this.addFormAnswer();
      this.addFormAnswer();
    }
  }

  initQuestionValues() {
    this.getFormQuestion.patchValue(this.questionTitle);

    for (let i = 0; i < this.answersArray.length; i++) {
      this.addFormAnswer();
      this.getFormAnswers.at(i).get('answerTitle').patchValue(this.answersArray[i].description);

      if (this.answersArray[i].true) {
        this.getFormAnswers.at(i).get('isRight').patchValue(this.answersArray[i].true);
      } else {
        this.getFormAnswers.at(i).get('isRight').disable();
      }

      this.answerIsSelected = true;
    }
  }

  getQuestionById() {
    this.loading = true;
    return this._testService.getQuestionById(this.questionIdForEdit)
      .then(
        (res: IQuestion) => {
          this.questionTitle = res.description;
          this.answersArray = res.answerList;
          this.loading = false;
        }, error => {
          this.loading = false;
          this._toastr.showError('Помилка отримання питання!');
          console.log(error);
        }
      );
  }

  editQuestion() {
    const body = {
      'description': this.questionForm.controls['questionTitle'].value,
      'answerList': []
    };

    this.getFormAnswers.controls.forEach(control => {
      body.answerList.push({
        'description': control.get('answerTitle').value,
        'true': !!control.get('isRight').value
      });
    });

    this.loading = true;
    console.log(body);
    this._testService.editQuestion(body, this.questionIdForEdit)
      .subscribe(
        () => {
          this.loading = false;
          this._toastr.showSuccess('Питання успішно відредаговано!');
          this._router.navigate(['tests-list']);
        }, error => {
          this.loading = false;
          this._toastr.showError('Помилка редагування питання!');
          console.log(error);
        }
      );
  }

  onChange(e, answer) {
    if (e.target.checked) {
      this.getFormAnswers.controls.forEach(control => {
        if (control !== answer) {
          control.get('isRight').disable();
        }
      });
      this.answerIsSelected = true;
    } else {
      this.getFormAnswers.controls.forEach(control => {
        control.get('isRight').enable();
      });
      this.answerIsSelected = false;
    }
  }

  buildForm() {
    this.questionForm = this._formBuilder.group({
      'questionTitle': ['', [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(5)
      ]],
      'answers': this._formBuilder.array([])
    });
  }

  createQuestion(e) {
    e.preventDefault();

    const body = {
      'description': this.questionForm.controls['questionTitle'].value,
      'answerList': []
    };

    this.getFormAnswers.controls.forEach(control => {
      body.answerList.push({
        'description': control.get('answerTitle').value,
        'true': !!control.get('isRight').value
      });
    });

    this.loading = true;
    this._testService.createQuestion(body)
      .subscribe(
        (res: number) => {
          this.createdQuestions.push(res);
          this.questionForm.reset();

          this.getFormAnswers.controls.forEach(control => {
            control.get('isRight').enable();
          });

          this.answerIsSelected = false;
          this.loading = false;
          this._toastr.showSuccess('Питання успішно створено.');
        }, error => {
          this.loading = false;
          this._toastr.showError('Помилка створення питання!');
          console.log(error);
        }
      );
  }

  addQuestionsToTest(e) {
    e.preventDefault();

    const body = {
      'questionsId': [].concat(this.createdQuestions.map(question => {
        return question['questionId'];
      })),
      'testId': this.createdQuizId
    };

    this.loading = true;
    this._testService.addQuestionsToTest(body)
      .subscribe(
        () => {
          this.loading = false;
          this._toastr.showSuccess('Питання успішно додано(-і) в тест.');
          this._router.navigate(['../tests-list']);
        },
        error => {
          this.loading = false;
          this._toastr.showError('Помилка додання питання(-ь) в тест!');
          console.log(error);
        }
      );
  }

  async deleteQuestion(question) {
    const result = await this._toastr.delNotify(`Ви дійсно бажаєте видалити питання "${question.description}" ?`,
      'question', 5000);
    if (result) {
      this.loading = true;
      this._testService.deleteQuestion(question.questionId)
        .subscribe(
          () => {
            this.createdQuestions.splice(this.createdQuestions.indexOf(question), 1);
            this.loading = false;
            this._toastr.showSuccess('Питання видалено успішно!');
          },
          error => {
            console.log(error);
            this.loading = false;
            this._toastr.showError('Помилка видалення питання');
          }
        );
    }
  }

  deleteAnswer() {
    this._testService.deleteAnswer(1);
  }

  createFormAnswer(): FormGroup {
    return this._formBuilder.group({
      'answerTitle': ['', [
        Validators.required,
        Validators.maxLength(200),
      ]],
      'isRight': ''
    });
  }

  get getFormQuestion() {
    return this.questionForm.get('questionTitle');
  }

  get getFormAnswers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  getFormAnswer(index: number) {
    return this.getFormAnswers.at(index).get('answerTitle');
  }

  addFormAnswer(): void {
    this.getFormAnswers.push(this.createFormAnswer());
  }

  deleteFormAnswer(answerIndex): void {
    this.getFormAnswers.removeAt(answerIndex);
  }
}
