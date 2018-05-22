import {IAnswer} from './Answer';

export interface IQuestion {
  questionId: number;
  description: string;
  answerList: IAnswer[];
}
