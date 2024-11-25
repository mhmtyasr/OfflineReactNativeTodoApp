import {createMap, createMapper, forMember, mapFrom} from '@automapper/core';
import {classes} from '@automapper/classes';
import {Todo} from '../entity/todo';
import {
  PostTodoParams,
  PutTodoParams,
  TodoBulkDataParams,
  TodoDto,
} from '@/model/services/todo/type';
import {TodoDetail} from '../entity/todoDetails';
import {
  PostTodoDetailParams,
  PutTodoDetailParams,
  TodoDetailDto,
  TodoDetailsBulkDataParams,
} from '@/model/services/todoDetails.ts/type';

const mapper = createMapper({
  strategyInitializer: classes(),
});

createMap(mapper, Todo, TodoDto);
createMap(mapper, PostTodoParams, Todo);
createMap(mapper, PutTodoParams, Todo);

createMap(mapper, TodoDetail, TodoDetailDto);
createMap(
  mapper,
  PostTodoDetailParams,
  TodoDetail,
  forMember(
    destination => destination.todoId,
    mapFrom(source => source.todo.clientId),
  ),
);

createMap(
  mapper,
  PutTodoDetailParams,
  TodoDetail,
  forMember(
    destination => destination.clientId,
    mapFrom(source => source.todoDetail.clientId),
  ),
);

createMap(mapper, Todo, TodoBulkDataParams);

createMap(
  mapper,
  TodoDetail,
  TodoDetailsBulkDataParams,
  forMember(
    destination => destination.todo.clientId,
    mapFrom(source => source.todo.clientId),
  ),
  forMember(
    destination => destination.todo.id,
    mapFrom(source => source.todo.id ?? 0),
  ),
);
export default mapper;
