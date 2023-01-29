import {
  AnyAction,
  CombinedState,
  configureStore,
  Reducer,
  ThunkDispatch,
} from "@reduxjs/toolkit";

import { combineReducers } from "redux";
import {
  collectionsSlice,
  glassesSlice,
  filtersSlice,
} from "@/entities/Product";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { GlassesInitialState } from "@/entities/Product/models/glasses";
import { FiltersInitialState } from "@/entities/Product/models/filters";
import { CollectionsInitialState } from "@/entities/Product/models/collections";

const rootReducer = combineReducers({
  collectionsState: collectionsSlice.reducer,
  glassesState: glassesSlice.reducer,
  filtersState: filtersSlice.reducer,
});

const reducerForHydrate = (state, action) => {
  console.log(action);
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (state.count) nextState.count = state.count; // preserve count value on client side navigation
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

const reducerForHydrateWithTypes = reducerForHydrate as Reducer<
  CombinedState<{
    collectionsState: CollectionsInitialState;
    glassesState: GlassesInitialState;
    filtersState: FiltersInitialState;
  }>,
  AnyAction
>;

export const setupStore = () => {
  return configureStore({
    reducer: reducerForHydrateWithTypes,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  });
};

setupStore().getState().collectionsState.collections;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
export type NextThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;

export const wrapper = createWrapper<AppStore>(setupStore, { debug: true });
