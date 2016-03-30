// vim: sts=2 sw=2 ts=2 expandtab

/*
 * reducerを定義するモジュール
 * reducerについては別途記述
 */

import * as RC from "./const/reducer_type.js";

/*
 * reducerの定義
 * reducer: stateとactionという二つの引数を取ってstateを返す関数
 * reducerを使ってstateとactionを結びつけ、一元的に管理する
 * わからないactionは必ず渡されたstateをそのまま返さなければならない
 * stateがundefinedの場合は初期stateを返さなければならない
 * stateを変更する場合には__必ず__新しい変数で返さなければならない
 */

/*
 * action.type : reducerに実行させるaction
 */

// jobのデータを保管するstateのreducer
export function job_data(state = {}, action) {
  if (action.type === RC.job.ASSIGN) {  // 渡されたのでstateを更新する
    // 新しいオブジェクトに現在のstateとactionで渡されたjobを結合する
    // これを Object.assign(state, action.job) とすると悲しみを生む
    return Object.assign({}, state, action.job );
  } else {  // 関係無かったのでstateはそのまま
    return state;
  }
}


// 武器state array1つの初期値
const weapon_default = {
  atk: 0,
  skill_level: 0,
  skill_type: ["none", "none"],
  cosmos: false,
  selected: false,
  type: "sword",
  name: ""
};
const WEAPON_MAX = 20;  // 武器配列の最大値
const WEAPON_MIN = 10;  // 武器配列の最小値
// 武器を保管するstateのreducer
// state: reducerに割りあてられたstateが渡される
// action: dispatchされたobject
export function weapon(state, action) {
  // 初期state
  if (state === undefined) {
    let initial_val = [
      {}, {}, {}, {}, {},
      {}, {}, {}, {}, {}
    ];
    state = initial_val.map((val) => { return Object.assign(val, weapon_default); });
  }
  // actionによって動作を分岐する
  // Array.from: 配列をコピーする関数
  if (action.type == RC.weapon.REPLACE && action.index < state.length) {
    state = Array.from(state);
    state[action.index] = Object.assign({}, weapon_default, action.value);
  } else if (action.type == RC.weapon.ENABLE && action.index < state.length) {
    state = Array.from(state);
    state[action.index] = Object.assign({}, state[action.index], { selected: true });
  } else if (action.type == RC.weapon.DISABLE && action.index < state.length) {
    state = Array.from(state);
    state[action.index] = Object.assign({}, state[action.index], { selected: false });
  } else if (action.type == RC.weapon.MOVE && action.from < state.length && action.to < state.length) {
    let target = state[action.from];
    state.splice(action.from, 1);
    state.splice(action.to, 0, target);
    state = Array.from(state);
  } else if (action.type == RC.weapon.DELETE && state.length > WEAPON_MIN && action.index < state.length) {
    state.splice(action.index, 1);
    state = Array.from(state);
  } else if (action.type == RC.weapon.APPEND && state.length < WEAPON_MAX && action.index < state.length) {
    let insert_state = Object.assign({}, weapon_default);
    state.splice(action.index, 0, insert_state);
    state = Array.from(state);
  }
  // 最終的なstateを返す
  return state;
}


// 召喚のarray項目1つのデフォルト
const summon_default = {
  name: "",
  selected: false,
  atk: 0,
  skill: [
    {
      type: "none",
      percent: 0
    },
    {
      type: "none",
      percent: 0
    }
  ]
};
const SUMMON_MAX = 10;  // 召喚配列の最大値
const SUMMON_MIN = 5;  // 召喚配列の最小値
// 召喚を保管するstateのreducer
// state: reducerに割りあてられたstate
// action: dispatchされたobject
export function summon(state, action) {
  // 初期stateの設定
  if (state === undefined) {
    let initial_val = [
      {}, {}, {}, {}, {}
    ];
    state = initial_val.map((val) => { return Object.assign(val, summon_default); });
  }
  // actionによる分岐
  if (action.type == RC.summon.REPLACE && action.index < state.length) {
    state = Array.from(state);
    state[action.index] = Object.assign({}, summon_default, action.value);
  } if (action.type == RC.summon.ENABLE && action.index < state.length) {
    state = Array.from(state);
    state[action.index] = Object.assign({}, state[action.index], { selected: true });
  } if (action.type == RC.summon.DISABLE && action.index < state.length) {
    state = Array.from(state);
    state[action.index] = Object.assign({}, state[action.index], { selected: false });
  } else if (action.type == RC.summon.MOVE && action.from < state.length && action.to < state.length) {
    let target = state[action.from];
    state.splice(action.from, 1);
    state.splice(action.to, 0, target);
    state = Array.from(state);
  } else if (action.type == RC.summon.DELETE && state.length > SUMMON_MIN && action.index < state.length) {
    state.splice(action.index, 1);
    state = Array.from(state);
  } else if (action.type == RC.summon.APPEND && state.length < SUMMON_MAX && action.index < state.length) {
    let insert_state = Object.assign({}, summon_default);
    state.splice(action.index, 0, insert_state);
    state = Array.from(state);
  }
  // 最終的なstateを返す
  return state;
}


// 基本情報を保管するstateのreducer
// state: reducerに割りあてられたstate
// action: dispatchされたobject
export function basicinfo(state, action) {
  // デフォルト値の設定
  var zenith = {
    atk: 0,
    weapon: [0, 0],
    attribute: 0
  };
  var atk_bonus = {
    percent: 0,
    value: 0
  };
  var default_value = {
    rank: 1,
    ship_bonus: 0,
    hp_percent: 100,
    affinity: "normal",
    job: "fighter",
    zenith: zenith,
    atk_bonus: atk_bonus
  };

  // stateがまだ何もないなら初期値を設定
  if (state === undefined) {
    state = default_value;
  }

  var retval = Object.assign({}, default_value, state);  // あらかじめ新しいObjectを作っておく

  // actionによる分岐
  if (action.type == RC.basic.ATK_PERCENT) {
    let atk_obj = Object.assign({}, state.atk_bonus, { percent: action.value });
    retval = Object.assign(retval, { atk_bonus: atk_obj });
  } else if (action.type == RC.basic.ATK_VALUE) {
    let atk_obj = Object.assign({}, state.atk_bonus, { value: action.value });
    retval = Object.assign(retval, { atk_bonus: atk_obj });
  } else if (action.type == RC.basic.ZENITH_ATK) {
    let zenith_obj = Object.assign({}, state.zenith, { atk: action.value });
    retval = Object.assign(retval, { zenith: zenith_obj });
  } else if (action.type == RC.basic.ZENITH_ATTR) {
    let zenith_obj = Object.assign({}, state.zenith, { attribute: action.value });
    retval = Object.assign(retval, { zenith: zenith_obj });
  } else if (action.type == RC.basic.ZENITH_WEAPON) {
    let zenith_obj = Object.assign({}, state.zenith, { weapon: action.value });
    retval = Object.assign(retval, { zenith: zenith_obj });
  } else if (action.type == RC.basic.RANK) {
    retval = Object.assign(retval, { rank: action.value });
  } else if (action.type == RC.basic.SHIP_BONUS) {
    retval = Object.assign(retval, { ship_bonus: action.value });
  } else if (action.type == RC.basic.HP_PERCENT) {
    retval = Object.assign(retval, { hp_percent: action.value });
  } else if (action.type == RC.basic.AFFINITY) {
    if (action.value == "good" || action.value == "bad") {
      retval = Object.assign(retval, { affinity: action.value });
    } else {
      retval = Object.assign(retval, { affinity: "normal" });
    }
  } else if (action.type == RC.basic.JOB) {
    retval = Object.assign(retval, { job: String(action.value) });
  } else {  // 俺には関係無かったぜ！
    return state;
  }

  return retval;
}

// 各種の全体state(読みこみ中など)を管理するreducer
export function component_state(state = {}, action) {
  // 返り値を入れる変数を作って…
  let retval = state;
  // あらかじめ定義されている状態に一致するかを調べる
  // 一致すれば新しい状態を作る
  // { [foo]: bar } は foo = "meow"のとき、{ meow: bar }と同じ
  Object.keys(RC.state).forEach((i) => {
    if (action.type === RC.state[i] && action.selector) {
      retval = Object.assign({}, state, { [action.selector]: RC.state[i] });
    }
  });
  return retval;
}