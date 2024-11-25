import {Todo} from '../entity/todo';
import RepositoryBase from './_repositoryBase';
import {injectable} from 'tsyringe';

@injectable()
export class TodoRepository extends RepositoryBase<Todo> {
  constructor() {
    super(Todo);
  }
}
