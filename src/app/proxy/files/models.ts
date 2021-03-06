import type { EntityDto } from '@abp/ng.core';

export interface CommentFileDto {
  fileId?: string;
  fileName?: string;
  filePath?: string;
}

export interface TaskFileDto extends EntityDto<string> {
  fileId?: string;
}

export interface FileDto extends EntityDto<string> {
  name?: string;
  path?: string;
}
