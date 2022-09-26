import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from './App';
import reportWebVitals from "./reportWebVitals";
import { observable, computed } from "mobx";
import { observer } from "mobx-react-lite";
// import { DevTools } from "mobx-react-devtools";

const counterState = observable({
  count: 0,
});

const nickName = new (class UserNickName {
  @observable firstName = "Ya";
  @observable age = 30;
  @computed get nickName() {
    console.log("generate nickName");
    return `${this.firstName}${this.age}`;
  }
})();

nickName.increment = function () {
  this.age = this.age + 1;
};

nickName.decrement = function () {
  this.age = this.age - 1;
};

class Counter extends React.Component {
  handleIncrement = () => {
    this.props.store.increment();
  };
  handleDecrement = () => {
    this.props.store.decrement();
  };

  render() {
    return (
      <div className="App">
        <h1>{this.props.store.age}</h1>
        <button onClick={this.handleIncrement}>-1</button>
        <button onClick={this.handleIncrement}>+1</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <DevTools /> */}
    <Counter store={nickName} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
