import {IQuestion} from './Question';

export interface ITest {
  testId: number;
  title: string;
  description: string;
  passingTime: number;
  questionList: IQuestion[];
}
