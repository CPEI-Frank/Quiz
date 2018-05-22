import {Injectable} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import swal from 'sweetalert2';

@Injectable()
export class ShowToastrService {
  constructor(public _toastr: ToastsManager) {
  }

  showSuccess(message: string) {
    this._toastr.success(message);
  }

  showError(message: string) {
    this._toastr.error(message);
  }

  showWarning(message: string) {
    this._toastr.warning(message);
  }

  passTestNotify(message, type, time) {
    return swal({
      text: message,
      type: type,
      timer: time,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Відміна',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Пройти',
      onOpen: function() {
        const zippi = new Audio('http://limonte.github.io/mp3/zippi.mp3');
        zippi.play();
      }
    }).then(
      (res) => {
        return !!res.value;
      }
    );
  }

  editQuestionNotify(question) {
    return swal({
      type: 'question',
      title: 'Виберіть питання для редагування',
      input: 'select',
      inputOptions: question,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Відміна',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Ок',
      onOpen: function() {
        const zippi = new Audio('http://limonte.github.io/mp3/zippi.mp3');
        zippi.play();
      }
    }).then(
      (res) => {
        return res.value;
      }
    );
  }

  delNotify(message, type, time) {
    return swal({
      text: message,
      type: type,
      timer: time,
      showCancelButton: true,
      cancelButtonColor: '#28a745',
      cancelButtonText: 'Відміна',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Видалити',
      onOpen: function() {
        const zippi = new Audio('http://limonte.github.io/mp3/zippi.mp3');
        zippi.play();
      }
    }).then(
      (res) => {
        return !!res.value;
      }
    );
  }
}
