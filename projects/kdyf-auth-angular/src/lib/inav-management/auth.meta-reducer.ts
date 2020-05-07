import {ActionReducer, MetaReducer} from '@ngrx/store';
import {localStorageSync} from 'ngrx-store-localstorage';
import {AuthState} from './auth.reducer';

export function sessionStorageSyncReducer(reducer: ActionReducer<AuthState>): ActionReducer<AuthState> {

  let keepLoggedIn: boolean = sessionStorage.getItem('keepLoggedIn') === 'true';
  let sessionStorageInUse = sessionStorage.getItem('authenticate') != null;
  let localStorageInUse = localStorage.getItem('authenticate') != null;

  let useLocalStorage = keepLoggedIn || (!sessionStorageInUse && localStorageInUse);

  if (useLocalStorage === true) {
    return localStorageSync({
      keys: ['user', 'urlRedirect'],
      rehydrate: true,
      storage: localStorage,
      removeOnUndefined: true
    })(reducer);
  } else {
    return localStorageSync({
      keys: ['user', 'urlRedirect'],
      rehydrate: true,
      storage: localStorage,
      removeOnUndefined: true
    })(reducer);
  }

}

export const metaReducers: MetaReducer<AuthState>[] = [sessionStorageSyncReducer];
