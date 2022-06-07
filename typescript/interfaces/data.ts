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
  stats: {
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
}

export interface IProfileProps {
  userData: {
    info: {
      id: number
    }
    stats: object
    friends: {
      confirmedFriends: object[];
      pendingFriends: object[];
      waitingFriends: object[];
      totalFriendsCount: number;     
    }
    limits: object
  }
}

export interface IProfileFriend {
    id: number
}

export interface IProfileFriends {
  confirmedFriends: object[];
  pendingFriends: object[];
  waitingFriends: object[];
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
  age: number | null
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
  value: number | null
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
