import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShowToastrService} from '../../services/show-toastr.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TestService} from '../../services/test.service';
import {ITest} from '../../shared/Test';

@Component({
  selector: 'app-quiz-editor',
  templateUrl: './quiz-editor.component.html',
  styleUrls: ['./quiz-editor.component.scss']
})
export class QuizEditorComponent implements OnInit {
  public quizForm: FormGroup;
  public loading = false;
  public isFormSubmitted: boolean;
  public passedQuizId: number;
  public createdQuizId: number;

  private _title: string;
  private _description: string;
  private _passingTime: number;

  get title() {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }
  get description() {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }
  get passingTime() {
    return this._passingTime;
  }
  set passingTime(value: number) {
    this._passingTime = value;
  }
  get getFormTitle() {
    return this.quizForm.get('title');
  }
  get getFormDescription() {
    return this.quizForm.get('description');
  }
  get getFormPassingTime() {
    return this.quizForm.get('passingTime');
  }

  public validationMessages = {
    'title': {
      'required': 'Обов\'язкове поле.',
      'minlength': 'Мінімальна кількість символів 5. ',
      'maxlength': 'Максимальна кількість символів 71.',
    },
    'description': {
      'required': 'Обов\'язкове поле.',
      'minlength': 'Мінімальна кількість символів 25. ',
      'maxlength': 'Максимальна кількість символів 165.',
    },
    'passingTime': {
      'required': 'Обов\'язкове поле.',
      'min': 'Мінімальний час 3 хвилини.',
      'max': 'Максимальний час 60 хвилин.',
      'pattern': 'Значенням цього поля має бути число.'
    }
  };

  constructor(private _formBuilder: FormBuilder,
              private _testService: TestService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _toastr: ShowToastrService) {
    this.passedQuizId = this._activatedRoute.snapshot.params['id'] || null;
  }

  ngOnInit() {
    this.buildForm();
    this.createOrEdit();
  }

  createOrEdit() {
    if (this.passedQuizId) {
      this._testService.getTestById(this.passedQuizId)
        .then(
          (res: ITest) => {
            this.title = res.title;
            this.description = res.description;
            this.passingTime = res.passingTime;
            this.loading = false;
          },
          error => {
            this.loading = false;
            this._toastr.showError('Виникли проблеми з отриманням поточного тесту');
            console.error(error);
          }
        );
    }
  }

  createQuiz(e) {
    e.preventDefault();

    const body = this.quizForm.value;
    body['passingTime'] = +body['passingTime'];

    this.loading = true;
    this._testService.createTest(body)
      .subscribe(
        (res: ITest) => {
          this.createdQuizId = res.testId;
          this.isFormSubmitted = true;
          this.quizForm.reset();
          this.loading = false;
          this._toastr.showSuccess('Тест успішно створено. Додавайте питання та відповіді!');
        }, error => {
          this.loading = false;
          this._toastr.showError('Помилка створення тесту!');
          console.log(error);
        }
      );
  }

  editQuiz(e) {
    e.preventDefault();

    this.loading = true;
    this._testService.editTest(this.quizForm.value, this.passedQuizId)
      .subscribe(
        () => {
          this.isFormSubmitted = true;
          this.quizForm.reset();
          this.loading = false;
          this._toastr.showSuccess('Тест успішно відредаговано!');
          this._router.navigate(['tests-list']);
        }, error => {
          this.loading = false;
          this._toastr.showError('Помилка редагування тесту!');
          console.log(error);
        }
      );
  }

  buildForm(): void {
    this.quizForm = this._formBuilder.group({
      'title': ['', [
        Validators.required,
        Validators.maxLength(71),
        Validators.minLength(5)
      ]],
      'description': ['', [
        Validators.required,
        Validators.maxLength(165),
        Validators.minLength(25)
      ]],
      'passingTime': ['', [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.min(3),
        Validators.max(60)
      ]]
    });
  }
}
