import ValidationException from '@/utils/exceptionUtils';
import {BusinessBase} from './_businessBase';
import {TodoDetailRepository} from '../repository/todoDetailRepository';
import {DependencyInjectionTokens} from '@/utils/dependencyInjectionTokens';
import {inject, injectable} from 'tsyringe';
import {TodoDetail} from '../entity/todoDetails';

@injectable()
export class TodoDetailBusiness extends BusinessBase<TodoDetail> {
  constructor(
    @inject(DependencyInjectionTokens.todoDetailRepository)
    repository: TodoDetailRepository,
  ) {
    super(repository);
  }

  getAll = async (params: any): Promise<TodoDetail[]> => {
    return this.repository.getAll(params);
  };

  addAsync = async (params: TodoDetail): Promise<TodoDetail> => {
    await this.validationForAddAsync(params);
    return this.repository.insertAndGet(params);
  };

  updateAsync = async (entity: TodoDetail): Promise<TodoDetail> => {
    console.log(entity);
    var todoDetail = await this.repository.getByClientId(entity.clientId);

    if (todoDetail == null) {
      throw ValidationException('Todo Detail Not Found');
    }

    todoDetail.isCompleted = entity.isCompleted;

    await this.validationForUpdateAsync(todoDetail);
    return this.repository.updateAndGet(todoDetail);
  };

  validationForAddAsync = async (params: TodoDetail): Promise<boolean> => {
    const todos = await this.repository.find({
      where: {
        todoId: params.todoId,
      },
    });

    if (todos.length >= 5) {
      throw ValidationException('5 adetten fazla todoya detail oluşturulamaz.');
    }
    return true;
  };

  validationForUpdateAsync = async (params: TodoDetail): Promise<boolean> => {
    const todoDetail = await this.repository.getByClientId(params.clientId!);

    if (!todoDetail) {
      throw ValidationException('Todo not found');
    }

    return true;
  };
}
