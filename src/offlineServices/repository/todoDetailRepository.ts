import {TodoDetail} from '../entity/todoDetails';
import RepositoryBase from './_repositoryBase';
import {injectable} from 'tsyringe';

@injectable()
export class TodoDetailRepository extends RepositoryBase<TodoDetail> {
  constructor() {
    super(TodoDetail);
  }
}
