import { Preference } from './preference.class';
import { Allergy } from './allergy.class';

export class UserInfo {
  id?: string;
  userId: string;
  username: string;
  name: string;
  gender: string;
  country: string;
  city: string;
  avatar: string;
  preferences: Preference[];
  allergies: Allergy[];
  userShoppingLists: string[];
  following: string[];
  followers: string[];
}
