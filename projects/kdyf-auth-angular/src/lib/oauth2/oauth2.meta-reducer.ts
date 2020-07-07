// NGRX
import {OAuth2State} from './oauth2.reducer';
import {ActionReducer, MetaReducer} from '@ngrx/store';
import {localStorageSync} from 'ngrx-store-localstorage';

export function sessionStorageSyncReducer(reducer: ActionReducer<OAuth2State>): ActionReducer<OAuth2State> {
  return localStorageSync({
    keys: ['user', 'profile', 'authenticate', 'urlRedirect'],
    rehydrate: true,
    storage: localStorage,
    removeOnUndefined: true
  })(reducer);
}

export const metaReducers: MetaReducer<OAuth2State>[] = [sessionStorageSyncReducer];
