
export interface AddTargetDto extends NameTargetDto {
  departmentId: number;
}

export interface NameTargetDto {
  name?: string;
}

export interface TargetDto extends NameTargetDto {
  id: number;
}
