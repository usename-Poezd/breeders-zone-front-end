import {put, select, takeEvery} from "redux-saga/effects";
import {ISearchAction, SEARCH} from "./types";
import {IRootState} from "../store";
import {IKind} from "../../types";
import {clearSearch} from "./actions";
import {push} from "connected-next-router";
const qs = require('qs');

export function* searchWatcher() {
    yield takeEvery(SEARCH, searchSaga);
}

function* searchSaga(action: ISearchAction) {
    const {payload} = action;
    const {search}: IRootState = yield select();
    const optionsMorphsIn = yield payload.morphs_in.map((item) => ([
        item.gene_id,
        item.trait_id
    ]));

    const optionsMorphsOut = yield payload.morphs_out.map((item) => ([
        item.gene_id,
        item.trait_id
    ]));


    const options: string = yield qs.stringify({
        q: search.query,
        kind: payload.kind !='any' ? payload.kind : null,
        subcategory: payload.subcategory !== 'any' ? payload.subcategory : null,
        locality: payload.locality !='any' ? payload.locality : null,
        price_min: payload.price_min,
        price_max: payload.price_max,
        morphs_in: optionsMorphsIn,
        morphs_out: optionsMorphsOut,
        sex: payload.sex !== 'any' ? payload.sex : null,
        age: payload.age !== 'any' ? payload.age : null,
        morphs_min: payload.morphs_min,
        morphs_max: payload.morphs_max,
    });

    yield put(push('/search?' + options));
    yield put(clearSearch());
}
