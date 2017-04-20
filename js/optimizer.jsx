// vim: sts=2 sw=2 ts=2 expandtab

/*
 * 編成最適化関連
 */
import React, { Component } from "react";
import CSSModules from "react-css-modules";
import { connect } from "react-redux";

import {
  enable_weapon_object,
  disable_weapon_object,
  enable_summon_object,
  disable_summon_object,
  enable_friend_object,
  disable_friend_object,
  sort_weapon_object,
  sort_summon_object,
  sort_friend_object,
  input_lock,
  input_unlock
} from "./actions.js";

import { WORKER_STATE, WORKER_COMMAND } from "./const/worker_type.js";
import { WEAPON_CHECKED_MAX, SUMMON_CHECKED_MAX, FRIEND_CHECKED_MAX } from "./const/number_const.js";

import styles from "optimizer.css";



// 最適化をまとめるセクション
class Optimizer extends Component {
  // コンストラクタ(関数をバインドする)
  constructor() {
    super();
    this.on_message = ::this.on_message;
    this.optimizer_func = ::this.optimizer_func;
  }

  // コンポーネントが表示される時の処理
  componentDidMount() {
    // 最適化用のWebWorkerを読み込み
    this.optimize_worker = new Worker("./dist/optimizer.js");  // Webpackのコンフィグ参照
    // イベントリスナーを追加
    this.optimize_worker.addEventListener("message", this.on_message);
  }

  // コンポーネントが廃棄される時の処理
  componentWillUnmount() {
    this.optimize_worker.removeEventListener("message", this.on_message);
    this.optimize_worker.terminate();
    this.optimize_worker = undefined;
  }

  // Workerから送られてきたメッセージをここで処理する
  on_message(message) {
    console.log(message);
  }

  // ボタンが押された時の挙動(武装最適化処理)
  optimizer_func() {
    this.optimize_worker.postMessage({
      command: WORKER_COMMAND.SET_BASIC_INFO,
      data: this.props.basicinfo
    });
    this.optimize_worker.postMessage({
      command: WORKER_COMMAND.SET_WEAPON,
      data: this.props.weapon
    });
    this.optimize_worker.postMessage({
      command: WORKER_COMMAND.SET_SUMMON,
      data: this.props.summon
    });
    this.optimize_worker.postMessage({
      command: WORKER_COMMAND.SET_FRIEND,
      data: this.props.friend
    });
  }

  render() {
    return (
      <section>
        <header styleName="title">編成最適ヒント算出</header>
        <form name="optimizer">
          <table styleName="base" id="optimizer_table">
            <Button
              optimizer_func={ this.optimizer_func }
              value={ this.state.running ? "実行中" : "停止" }
              disabled={ this.state.running ? false : true }
              max={ 100 }
              count={ this.state.percent }
              />
          </table>
        </form>
      </section>
    );
  }
}
Optimizer = CSSModules(Optimizer, styles);
const mapStateToOptimizerProps = (state) => {
  return {
    weapon: state.weapon,
    summon: state.summon,
    friend: state.friend,
    basicinfo: state.basicinfo
  };
};
const mapActionCreatorsToOptimizerProps = {
  enable_weapon_object,
  disable_weapon_object,
  sort_weapon_object,
  enable_summon_object,
  disable_summon_object,
  sort_summon_object,
  enable_friend_object,
  disable_friend_object,
  sort_friend_object,
  input_lock,
  input_unlock
};
Optimizer = connect(mapStateToOptimizerProps, mapActionCreatorsToOptimizerProps)(Optimizer);
export default Optimizer;


class Button extends Component {
  constructor(props) {
    super(props);
    this.start_button = ::this.start_button;
    this.state = {};
  }

  start_button(event) {
    this.props.optimizer_func();
  }

  render() {
    return (
      <tbody>
        <tr styleName="row">
          <th styleName="header">
            ぼたん
          </th>
          <td>
            <input type="button" value={this.props.value} onClick={this.start_button} />
            <progress
              max={this.props.max}
              value={this.props.count}
            >
              進捗
            </progress>
          </td>
        </tr>
      </tbody>
    );
  }
}
Button = CSSModules(Button, styles);
