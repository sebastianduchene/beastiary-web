import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { commitAddNotification, commitRemoveNotification } from './mutations';
import { AppNotification, MainState } from './state';
import { State } from '../state';

type MainContext = ActionContext<MainState, State>;

export const actions = {
    async removeNotification(context: MainContext, payload: { notification: AppNotification, timeout: number }) {
        return new Promise((resolve) => {
            setTimeout(() => {
                commitRemoveNotification(context, payload.notification);
                resolve(true);
            }, payload.timeout);
        });
    },
};

const { dispatch } = getStoreAccessors<MainState | any, State>('');

export const dispatchRemoveNotification = dispatch(actions.removeNotification);
