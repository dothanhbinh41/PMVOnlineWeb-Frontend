import { Observable } from 'rxjs';

export default async function toPromise<T>(obs: Observable<T>): Promise<T> {
  try {
    return await obs.toPromise();
  } catch (error) {
    return undefined;
  }
}
