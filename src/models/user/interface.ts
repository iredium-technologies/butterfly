export interface UserInterface {
  _id: string;
  first_name: string; // eslint-disable-line camelcase
  last_name: string; // eslint-disable-line camelcase
  username: string;
  email: string;
  password: string;
  fullName(): string;
  getRouteKeyName(): string;
  isAdmin(): boolean;
  isRoot(): boolean;
  comparePassword(): boolean;
}
