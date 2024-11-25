import {AutoMap} from '@automapper/classes';

export class Auditable {
  @AutoMap()
  createdDate: Date;

  @AutoMap()
  updatedDate: Date | null;

  @AutoMap()
  deletedDate: Date | null;
}

export class BaseResponseDTO extends Auditable {
  @AutoMap()
  id: number;
  @AutoMap()
  clientId: string;
}

export class BaseRequestParams {
  @AutoMap()
  clientId: string;
  @AutoMap()
  id: number | null;
}
