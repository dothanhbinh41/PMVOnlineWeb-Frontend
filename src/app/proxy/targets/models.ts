
export interface AddOrEditDepartmentsToTargetDto {
  departments: number[];
}

export interface NameTargetDto {
  name?: string;
}

export interface TargetDto extends NameTargetDto {
  id: number;
}
