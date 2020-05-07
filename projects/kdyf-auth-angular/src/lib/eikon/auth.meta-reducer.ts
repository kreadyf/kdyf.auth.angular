import { ActionReducer, MetaReducer, Action } from "@ngrx/store";
import { localStorageSync } from "ngrx-store-localstorage";
import { AuthState } from './auth.reducer';
import { AuthService } from './services/auth.service';
import { AuthActions } from './auth.actions';

export function localStorageSyncReducer(reducer: ActionReducer<AuthState>): ActionReducer<AuthState> {
    return localStorageSync({keys: ['authenticate', "user"], rehydrate:true, removeOnUndefined: true})(reducer);
}

export const metaReducers: MetaReducer<AuthState>[] = [localStorageSyncReducer];
