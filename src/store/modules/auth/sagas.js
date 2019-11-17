import { put, all, takeLatest, call } from 'redux-saga/effects';
import { Alert } from 'react-native';
import * as Actions from './actions';
import api from '~/services/api';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const res = yield call(api.post, '/sessions', { email, password });

    const { token, user } = res.data;

    if (user.admin) {
      Alert.alert(
        'Erro no login',
        'O usuário não pode ser prestador de serviços'
      );
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(Actions.signInSuccess(token, user));

    // history.push('/Student');
  } catch (err) {
    Alert.alert(
      'Falha no login',
      'Houve um erro na autenticação, verifique seus dados'
    );
    yield put(Actions.signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;

    yield call(api.post, '/users', {
      name,
      email,
      password,
    });
    // history.push('/');
  } catch (err) {
    Alert.alert(
      'Falha no cadastro',
      'Houve um erro no cadastro, verifique seus dados'
    );

    yield put(Actions.signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

export function signOut() {
  // history.push('/');
  api.defaults.headers.Authorization = ``;
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest(Actions.SIGN_IN_REQUEST, signIn),
  takeLatest(Actions.SIGN_UP_REQUEST, signUp),
  takeLatest(Actions.SIGN_OUT, signOut),
]);
