import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { verifyAuth } from "./Actions/auth";
import rootReducer from "./Reducers/index";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import JSOG from "jsog";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

export const JSOGTransform = createTransform(
  (inboundState, key) => JSOG.encode(inboundState),
  (outboundState, key) => JSOG.decode(outboundState)
);

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  transforms: [JSOGTransform],
  whitelist: ["userData", "docRef", "retrieveSuccess"],
};

const pReducer = persistReducer(persistConfig, rootReducer);

export function configureStore(persistedState) {
  const store = createStore(
    pReducer,
    persistedState,
    applyMiddleware(thunkMiddleware)
  );
  store.dispatch(verifyAuth());
  return store;
}
export const store = configureStore();
export default persistStore(store);
