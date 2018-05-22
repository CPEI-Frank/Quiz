import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable()
export class QuizFormService {
  public formErrors = {
    'title': '',
    'description': '',
    'passingTime': '',
    'questionTitle': '',
    'answerTitle': ''
  };

  public validationMessages = {
    'title': {
      'required': 'Назва: Обов\'язкове поле.',
      'minlength': 'Назва: Мінімальна кількість символів 5. ',
      'maxlength': 'Назва: Максимальна кількість символів 95.',
    },
    'description': {
      'required': 'Опис: Обов\'язкове поле.',
      'minlength': 'Опис: Мінімальна кількість символів 25. ',
      'maxlength': 'Опис: Максимальна кількість символів 230.',
    },
    'passingTime': {
      'required': 'Час на проходження: Обов\'язкове поле.',
      'min': 'Час на проходження: Мінімальний час 3 хвилини.',
      'max': 'Час на проходження: Максимальний час 60 хвилин.',
      'pattern': 'Час на проходження: Значенням цього поля має бути число.'
    },
    'questionTitle': {
      'required': 'Назва питання: Обов\'язкове поле.',
      'minlength': 'Назва питання: Мінімальна кількість символів 5. ',
      'maxlength': 'Назва питання: Максимальна кількість символів 200.',
    }
  };

  onValueChange(currentForm: FormGroup, validationMessages: Object): Object {
    if (!currentForm) { return; }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = currentForm.get(field);

        if (control && control.dirty && control.invalid) {
          const message = validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += message[key] + ' ';
            }
          }
        }
      }
    }
    return this.formErrors;
  }
}
