import { ActionContext, ActionTree, Commit, CommitOptions, DispatchOptions, GetterTree, MutationTree } from 'vuex';
import { v4 } from 'uuid';
import { IHeightMap } from '@/interfaces/IHeightMap';

// STATE
export interface IHeightMapsState {
  list: IHeightMap[];
  selectedId: string | null;
}

export const state: IHeightMapsState = {
  list: [],
  selectedId: null,
}

// GETTERS
export interface IHeightMapGetters {
  selectedHeightMap(state: IHeightMapsState): IHeightMap | undefined;
}

export type THeightMapGetters = GetterTree<IHeightMapsState, IHeightMapsState> & IHeightMapGetters;

export const getters: THeightMapGetters = {
  selectedHeightMap(state: IHeightMapsState): IHeightMap | undefined {
    const { list, selectedId} = state;

    return list.find(function (heightMap: IHeightMap): boolean {
      return heightMap.id === selectedId;
    });
  },
}

// ACTIONS
export type THeightMapPayload = Omit<IHeightMap, 'id'>;
export type THeightMapActionContext = ActionContext<IHeightMapsState, IHeightMapsState>;
export enum EHeightMapActions {
  Add = 'Add',
  Remove = 'Remove',
  Select = 'Select',
}

export interface IHeightMapActions {
  [EHeightMapActions.Add](context: THeightMapActionContext, payload: THeightMapPayload): void;
  [EHeightMapActions.Remove](context: THeightMapActionContext, payload: string): void;
  [EHeightMapActions.Select](context: THeightMapActionContext, payload: string): void;
}

export type THeightMapActions = ActionTree<IHeightMapsState, IHeightMapsState> & IHeightMapActions;

export const actions: THeightMapActions = {
  [EHeightMapActions.Add](context: { commit: Commit }, payload: THeightMapPayload): void {
    context.commit(EHeightMapActions.Add, payload);
  },
  [EHeightMapActions.Remove](context: { commit: Commit }, id: string): void {
    context.commit(EHeightMapActions.Remove, id);
  },
  [EHeightMapActions.Select](context: { commit: Commit }, id: string): void {
    context.commit(EHeightMapActions.Select, id);
  },
}

// MUTATIONS
export interface IHeightMapMutations {
  [EHeightMapActions.Add](state: IHeightMapsState, payload: THeightMapPayload): void;
  [EHeightMapActions.Remove](state: IHeightMapsState, payload: string): void;
  [EHeightMapActions.Select](state: IHeightMapsState, payload: string): void;
}

export type THeightMapMutations = MutationTree<IHeightMapsState> & IHeightMapMutations;

export const mutations = {
  [EHeightMapActions.Add](state: IHeightMapsState, payload: THeightMapPayload): void {
    const id = v4();
    const heightMap = {
      ...payload,
      id,
    };

    state.list.unshift(heightMap);
    state.selectedId = id;
  },
  [EHeightMapActions.Remove](state: IHeightMapsState, id: string): void {
    state.list = state.list.filter(function (heightMap: IHeightMap): boolean {
      return heightMap.id !== id;
    });

    if (state.selectedId === id) {
      state.selectedId = null;

      if (state.list.length > 0) {
        state.selectedId  = state.list[0].id;
      }
    }
  },
  [EHeightMapActions.Select](state: IHeightMapsState, id: string): void {
    state.selectedId = id;
  }
};

// STORE
export interface IHeightMapStore {
  state: {
    heightMaps: IHeightMapsState,
  },
  getters: {
    [K in keyof IHeightMapGetters]: ReturnType<IHeightMapGetters[K]>
  },
  dispatch<K extends keyof IHeightMapActions>(
    key: K,
    payload: Parameters<IHeightMapActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<IHeightMapActions[K]>,
  commit<K extends keyof IHeightMapMutations, P extends Parameters<IHeightMapMutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<IHeightMapMutations[K]>
}

export const heightMaps = {
  state,
  getters,
  actions,
  mutations,
};
