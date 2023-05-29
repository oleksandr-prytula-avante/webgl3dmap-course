import {
  ActionContext,
  ActionTree,
  Commit,
  CommitOptions,
  DispatchOptions,
  GetterTree,
  MutationTree,
} from 'vuex';
import { v4 } from 'uuid';
import axios from 'axios';

import { IHeightMap } from '@/interfaces/IHeightMap';
import { getLandscapeMatrixFromDataUrl } from '@/utils/files';

// STATE
export interface IHeightMapsState {
  list: IHeightMap[];
  isLoading: boolean;
  selectedId: string | null;
}

export const state: IHeightMapsState = {
  list: [],
  isLoading: false,
  selectedId: null,
}

// GETTERS
export interface IHeightMapGetters {
  selectedHeightMap(state: IHeightMapsState): IHeightMap | undefined;
}

export type THeightMapGetters = GetterTree<IHeightMapsState, IHeightMapsState> & IHeightMapGetters;

export const getters: THeightMapGetters = {
  selectedHeightMap(state: IHeightMapsState): IHeightMap | undefined {
    const { list, selectedId } = state;

    return list.find(function (heightMap: IHeightMap): boolean {
      return heightMap.id === selectedId;
    });
  },
}

// ACTIONS
export type THeightMapPayload = Omit<IHeightMap, 'id'>;
export type THeightMapApiPayload = Pick<IHeightMap, 'colorImage' | 'greyscaleImage'>;
export type THeightMapActionContext = ActionContext<IHeightMapsState, IHeightMapsState>;
export enum EHeightMapActions {
  Init = 'Init',
  Add = 'Add',
  Remove = 'Remove',
  Select = 'Select',
}

export enum EHeightMapRoutes {
  HeightMap = '/heightmap',
}

export interface IHeightMapActions {
  [EHeightMapActions.Init](context: THeightMapActionContext): void;
  [EHeightMapActions.Add](context: THeightMapActionContext, payload: THeightMapPayload): void;
  [EHeightMapActions.Remove](context: THeightMapActionContext, payload: string): void;
  [EHeightMapActions.Select](context: THeightMapActionContext, payload: string): void;
}

export type THeightMapActions = ActionTree<IHeightMapsState, IHeightMapsState> & IHeightMapActions;

export const actions: THeightMapActions = {
  [EHeightMapActions.Init](context: { commit: Commit }): void {
    context.commit(EHeightMapActions.Init);
  },
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
  [EHeightMapActions.Init](context: IHeightMapsState): void;
  [EHeightMapActions.Add](state: IHeightMapsState, payload: THeightMapPayload): void;
  [EHeightMapActions.Remove](state: IHeightMapsState, id: string): void;
  [EHeightMapActions.Select](state: IHeightMapsState, id: string): void;
}

export type THeightMapMutations = MutationTree<IHeightMapsState> & IHeightMapMutations;

export const mutations = {
  async [EHeightMapActions.Init](state: IHeightMapsState): Promise<void> {
    const response = await axios.get(EHeightMapRoutes.HeightMap);
    const data = response.data as Record<string, THeightMapApiPayload> || {};
    const entries = Object.entries(data);

    state.isLoading = true;

    for (const entry of entries) {
      const [id, { colorImage, greyscaleImage }] = entry;
      const matrix = await getLandscapeMatrixFromDataUrl(colorImage);

      const heightMap: IHeightMap = {
        id,
        matrix,
        colorImage,
        greyscaleImage,
      };

      state.list.push(heightMap);
    }

    state.isLoading = false;

    if (state.list.length > 0) {
      const heightMap = state.list[state.list.length - 1];

      state.selectedId = heightMap.id;
    }
  },
  async [EHeightMapActions.Add](state: IHeightMapsState, payload: THeightMapPayload): Promise<void> {
    const data = {
      colorImage: payload.colorImage,
      greyscaleImage: payload.greyscaleImage,
    };

    state.isLoading = true;

    await axios.post(EHeightMapRoutes.HeightMap, data);

    state.isLoading = false;

    const id = v4();
    const heightMap = {
      ...payload,
      id,
    };

    state.list.unshift(heightMap);
    state.selectedId = id;
  },
  async [EHeightMapActions.Remove](state: IHeightMapsState, id: string): Promise<void> {
    state.list = state.list.filter(function (heightMap: IHeightMap): boolean {
      return heightMap.id !== id;
    });
    state.isLoading = true;

    await axios.delete(`${EHeightMapRoutes.HeightMap}/${id}`);

    state.isLoading = false;

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
