import { all, takeLatest, put, call } from 'redux-saga/effects';
import { Alert } from 'react-native';

import api from '~/services/api';
import * as Actions from './actions';

export function* updateProfile({ payload }) {
  try {
    const { name, email, ...rest } = payload.data;

    const profile = {
      name,
      email,
      ...(rest.oldPassword ? rest : {}),
    };

    const response = yield call(api.put, 'users', profile);

    Alert.alert('Sucesso', 'Perfil atualizado com sucess!');

    yield put(Actions.updateProfileSuccess(response.data));
  } catch (error) {
    Alert.alert(
      'Falha na atualização',
      'Erro ao atualizar perfil, confira seus dados!'
    );
    yield put(Actions.updateProfileFailure());
  }
}

export default all([takeLatest(Actions.UPDATE_PROFILE_REQUEST, updateProfile)]);
