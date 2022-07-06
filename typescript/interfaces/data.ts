export interface IStringAvatar {
  children: string
}

export interface IWaitingFriendsItem {
  id: number
  name: string
  surname: string
  username: string
  avatar: null | string
}

export interface IFilteredUser {
  id: number
  name: string
  surname: string
  username: string
  avatar: null | string
  stats?: {
    totalChats: number
    totalMessagesSent: number
    totalCharactersEntered: number
  }
}

export interface IInputPasswordValues {
  password: string
  showPassword: boolean
}

export interface ISignUpSubmit {
  email: string
  password: string
  firstName: string
  lastName: string
  username: string
}

import { ReactNode } from "../types/data";

export interface IHomeProps{
  children: ReactNode
}

export interface IProfileGetServerSideProps {
  params: {
    id: number
  }
  locale: string
}

export interface IFriend {
  id: number
  name: string
  surname: string
  username: string
  avatar: string
}

export interface IProfileProps {
  userData: {
    info: {
      name: string
      surname: string
      username: string
      email: string
      id: number
      age: string | number | null
      location: any
      avatar: string | null
      instagramLink: string | null
      telegramUsername: string | null
      discordUsername: string | null
    }
    stats: {
      totalChats: number
      totalMessagesSent: number
      totalCharactersEntered: number
    }
    friends: {
      confirmedFriends: IFriend[] | null[];
      pendingFriends: IFriend[] | null[];
      waitingFriends: IFriend[] | null[];
      totalFriendsCount: number;     
    }
    limits: {
      freeSpaceTaken: number
      filesSent: number
    }
  }
}

export interface IProfileFriend {
    id: number
}

export interface IProfileFriends {
  confirmedFriends: IFriend[] | null | null[];
  pendingFriends: IFriend[] | null | null[];
  waitingFriends: IFriend[] | null | null[];
  totalFriendsCount: number;
}

export interface IProfileConfirmedFriend {
  id: number
  avatar: string
  name: string
  surname: string
  username?: string
}

export interface IProfileChangingProps {
  info: Array<any>
  setChanging: (bool: boolean) => void
}

export interface IProfileChangingSubmit {
  name: string
  surname: string
  username: string
  age: number | string
  location: any 
}

export interface ILeaderboardRow {
    username: string
    id: number
    name: string
    surname: string
    avatar_url: string | null
    stats: {
        totalChats: number
        totalMessagesSent: number
        totalCharactersEntered: number
    },
}

export interface ILeaderBoardCreateUserData {
    info: {
      name: string
      surname: string
      username: string
      id: number
      avatar: string
    }
    stats: {
      totalChats: number
      totalMessagesSent: number
      totalCharactersEntered: number
    }
}

export interface ILeaderboardData {
  icon: HTMLElement
  label: string
}

export interface ILoginSubmit {
  email: string
  password: string
}

export interface IPersonalSubmit {
  instagramLink: string | null
  telegramUsername: string | null
  discordUsername: string | null
}

export interface ITokenSubmit {
  token: string
}

export interface IChatProgressProps {
  value: number
  filename?: string | null
}


export interface IChatSnackbar {
  snackbarOpen: boolean
  Transition: any,
}

export interface IChatAuthRef {
    info: Array<any>
    stats: Array<any>;
    friends: {
      confirmedFriends: Array<any>;
      pendingFriends: Array<any>;
      waitingFriends: Array<any>;
      totalFriendsCount: number;
    };
    limits: object
}

export interface ISocketOnMessage {
  data: string
}

export interface IChatMessage {
  username?: string
  id?: number
  isFile?: boolean
  event?: string
  userId?: number
  name?: string
  surname?: string
  date?: string | number
  link?: string
  message: string
  avatar?: string
} 

export interface IChatUploadedFile {
  Bucket: string
  ETag: string
  Key: string
  Location: string
  key: string
}

export interface IGoogleUserData {
  email: string | null
  given_name: string | null
  family_name?: string | null
  picture: string | null
}

export interface IRowProps {
  row: ILeaderboardRow
  idx: number
}

export interface INewsProps {
  isMobile: boolean
}

export interface ILocale {
  locale: string
}

export interface IMobileMenuProps {
  mobileMoreAnchorEl: null | HTMLElement
  setMobileMoreAnchorEl: (value: null | HTMLElement) => void
}

interface IRef<T> {
  current: T
}

export interface IConnectionProps {
  theme: object
  error: string | null
  isPending: boolean
  isLeft: IRef<boolean>
  socket: IRef<any>
  connectedUsersInterval: IRef<any>
  setMessages: (value: any) => void
  setError: (value: string | null) => void
  setPending: (bool: boolean) => void
  setConnected: (bool: boolean) => void
}

export interface IOtherTranslation {
  join: string
  wait: string
  profile: string
  account_settings: string
  log_out: string
  confirm: string
  reject: string
  friends_msg_1: string
  friends_msg_2: string
  messages: string
  friend_requests: string
  total_chats: string
  total_messages_sent: string
  total_entered_characters: string
  info: string
  filled: string
  min: (count: number) => string
  max: (count: number) => string
  r_and_l: string
  latin: string
  numbers: string
  cancel: string
  sign_up: string
  password: string
  already_a_user: string
  next: string
  reg_confirmed: string
  continue_as_guest: string
  name: string
  surname: string
  username: string
  to_sign_up: string
  guests_delete: string
  got_it: string
  invalid_email: string
}