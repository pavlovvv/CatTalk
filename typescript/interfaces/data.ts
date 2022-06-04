export interface IStringAvatar {
  children: string;
}

export interface IWaitingFriendsItem {
  id: number;
  name: string;
  surname: string;
  username: string;
  avatar: null | string;
}

export interface IFilteredUser {
  id: number
  name: string
  surname: string
  username: string
  avatar: null | string
}
