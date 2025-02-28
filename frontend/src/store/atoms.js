import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    token: null,
    userId: null
  }
});

export const userState = atom({
  key: 'userState',
  default: {
    username: '',
    email: '',
    credits: 0
  }
});

export const loadingState = atom({
  key: 'loadingState',
  default: {
    isLoading: false,
    message: ''
  }
});

export const generationState = atom({
  key: 'generationState',
  default: {
    isGenerating: false,
    error: null,
    result: null
  }
});

export const themeState = atom({
  key: 'themeState',
  default: 'dark'
});
