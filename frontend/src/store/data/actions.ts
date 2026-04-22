import { Trace } from '@/interfaces';
import { parseLogFile, readFileAsText } from '@/logParser';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { commitAddNotification, commitRemoveNotification } from '../main/mutations';
import { State } from '../state';
import {
    commitAddParsedTrace,
    commitReloadParsedTrace,
    commitSetActiveParams,
    commitSetActiveTrace,
    commitSetBurnIn,
    commitSetLoadingSamples,
} from './mutations';
import { DataState } from './state';

type MainContext = ActionContext<DataState, State>;

export const actions = {
    async actionGetTraces(_context: MainContext) {
        // no-op: traces are loaded client-side via drag-and-drop
    },
    async actionCreateTrace(context: MainContext, file: File) {
        const loadingNotification = { content: `Loading ${file.name}...`, showProgress: true };
        commitAddNotification(context, loadingNotification);
        try {
            const content = await readFileAsText(file);
            const trace = parseLogFile(file, content);
            commitAddParsedTrace(context, trace);
            commitAddNotification(context, { content: `${file.name} loaded`, color: 'success' });
        } catch (e) {
            commitAddNotification(context, { content: `Error: ${(e as Error).message}`, color: 'error' });
        }
        commitRemoveNotification(context, loadingNotification);
    },
    async actionReloadTrace(context: MainContext, payload: {traceID: number, file: File}) {
        const loadingNotification = { content: `Reloading ${payload.file.name}...`, showProgress: true };
        commitAddNotification(context, loadingNotification);
        try {
            const content = await readFileAsText(payload.file);
            const trace = parseLogFile(payload.file, content);
            trace.id = payload.traceID;
            commitReloadParsedTrace(context, trace);
            commitAddNotification(context, { content: `${payload.file.name} reloaded`, color: 'success' });
        } catch (e) {
            commitAddNotification(context, { content: `Error: ${(e as Error).message}`, color: 'error' });
        }
        commitRemoveNotification(context, loadingNotification);
    },
    async actionSetActiveTrace(context: MainContext, payload: Trace) {
        commitSetActiveTrace(context, payload);
    },
    async actionSetActiveParams(context: MainContext, payload: {traceID: number, params: string[]}) {
        commitSetActiveParams(context, payload);
    },
    async actionGetSamples(_context: MainContext, _payload: any) {
        // no-op: all samples are already in trace.parameters after parsing
    },
    async actionSetBurnIn(context: MainContext, payload: {traceID: number, burnIn: number}) {
        commitSetBurnIn(context, payload);
    },
    async actionSetLoadingSamples(context: MainContext, payload: {traceID: number, loading: boolean}) {
        commitSetLoadingSamples(context, payload);
    },
};

const { dispatch } = getStoreAccessors<DataState | any, State>('');

export const dispatchGetTraces = dispatch(actions.actionGetTraces);
export const dispatchCreateTrace = dispatch(actions.actionCreateTrace);
export const dispatchReloadTrace = dispatch(actions.actionReloadTrace);
export const dispatchSetActiveTrace = dispatch(actions.actionSetActiveTrace);
export const dispatchGetSamples = dispatch(actions.actionGetSamples);
export const dispatchSetActiveParams = dispatch(actions.actionSetActiveParams);
export const dispatchSetBurnIn = dispatch(actions.actionSetBurnIn);
export const dispatchSetLoadingSamples = dispatch(actions.actionSetLoadingSamples);


