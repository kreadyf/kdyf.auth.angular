// NGRX
import {AuthState} from './jws-simple.reducer';
import {ActionReducer, MetaReducer} from '@ngrx/store';
import {localStorageSync} from 'ngrx-store-localstorage';

export function localStorageSyncReducer(reducer: ActionReducer<AuthState>): ActionReducer<AuthState> {
  return localStorageSync({
    keys: ['authenticate', 'user'],
    rehydrate: true,
    removeOnUndefined: true
  })(reducer);
}

export const metaReducers: MetaReducer<AuthState>[] = [localStorageSyncReducer];

