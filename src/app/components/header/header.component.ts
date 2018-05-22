import {Component} from '@angular/core';
import {TestService} from '../../services/test.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private _testService: TestService) { }

  onSearchChanges(term) {
    this._testService.changeSearch(term);
  }
}
