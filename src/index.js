import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from './App';
import reportWebVitals from "./reportWebVitals";
import {
  observable,
  computed,
  makeAutoObservable,
  extendObservable,
  configure,
  action,
  runInAction,
  autorun,
  // decorate,
} from "mobx";
import { observer } from "mobx-react-lite";
configure({ enforceActions: "observed" });

// import { DevTools } from "mobx-react-devtools";
// configure({ enforceActions: "observed" });

// const counterState = observable({
//   count: 0,
// });

// const nickName = observable(
//   {
//     firstName: "Ya",
//     age: 30,

//     increment: function () {
//       return (this.age = this.age + 1);
//     },

//     decrement: function () {
//       this.age = this.age - 1;
//     },

//     get nickName() {
//       console.log("generate nickName");
//       return `${this.firstName}${this.age}`;
//     },
//   },
//   { increment: action("plus one"), decrement: action("minus one") },
//   { name: "nickNameObservable" }
// () => appStore.count > 5,
//   () => {
//     alert("Count value is more than 5");
//   };
// );

// autorun(() => {
//   alert(`count value is ${appStore.count}`);
// }, {
// name: 'custom autorun', delay: 3000
// });

// const todos = observable([{ text: "text 1" }, { text: "text 2" }]);

class Store {
  @observable devList = [
    { name: "Jack", sp: 12 },
    { name: "Max", sp: 10 },
    { name: "Leo", sp: 8 },
  ];
  @observable filter = "";
  @computed get totalSum() {
    return this.devList.reduce((sum, { sp }) => {
      return (sum = sum + sp);
    }, 0);
  }
  @computed get topPerformer() {
    const maxSp = Math.max(...this.devList.map(({ sp }) => sp));
    return this.devList.find(({ sp, name }) => {
      if (maxSp === sp) {
        return name;
      }
    });
  }

  @computed get filterDevelopers() {
    const matchedFilter = new RegExp(this.filter, "i");
    return this.devList.filter(
      ({ name }) => !this.filter || matchedFilter.test(name)
    );
  }

  @action clearList() {
    this.devList = [];
  }

  @action addDeveloper(dev) {
    this.devList.push(dev);
  }

  @action updateFilter(value) {
    this.filter = value;
  }
  @observable user = null;
  @action.bound setUser(results) {
    this.user = results[0];
  }
  @action.bound getUser() {
    fetch("https://randomuser.me/api")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.results) {
          console.log("json", json);

          console.log("this", this);
          // this.setUser(json.results);
          runInAction(() => {
            this.user = json.results[0];
          });
        }
      });
  }
}

/* not working

decorate(Store, {
  devList: observable,
  totalSum: computed,
  topPerformer: computed,
  clearList: action,
  addDeveloper: action,
});

*/

const appStore = new Store();
console.log("appStore", appStore);

const Row = ({ data: { name, sp } }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{sp}</td>
    </tr>
  );
};

// @observer
class Table extends React.Component {
  render() {
    const { store } = this.props;
    return (
      <table>
        <thead>
          <tr>
            <td>Name:</td>
          </tr>
          <tr>
            <td>SP:</td>
          </tr>
        </thead>
        <tbody>
          {store.filterDevelopers.map((dev, i) => {
            return <Row key={i} data={dev} />;
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Team SP:</td>
            <td>{store.totalSum}</td>
          </tr>
          <tr>
            <td>Top Performer:</td>
            <td>{store.topPerformer ? store.topPerformer.name : ""}</td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

class Controls extends React.Component {
  addDeveloper = () => {
    const name = prompt("The name:");
    const sp = parseInt(prompt("The story points:"), 10);
    this.props.store.addDeveloper({ name, sp });
  };
  clearList = () => {
    this.props.store.clearList();
  };
  filterDevelopers = ({ target: { value } }) => {
    this.props.store.updateFilter(value);
  };
  render() {
    return (
      <div>
        <button onClick={this.clearList}>Clear table</button>
        <button onClick={this.addDeveloper}>Add record</button>
        <input
          value={this.props.store.filter}
          onChange={this.filterDevelopers}
        />
      </div>
    );
  }
}
// @observer Controls
class Counter extends React.Component {
  // handleIncrement = () => {
  //   console.log("this.props=", this.props);
  //   this.props.store.increment();
  // };
  // handleDecrement = () => {
  //   this.props.store.decrement();
  // };

  render() {
    console.log("this.props", this.props);
    const { store } = this.props;

    return (
      <div className="App">
        {/* <DevTools /> */}
        <button onClick={store.getUser}>get user</button>
        <h1>{store.user ? store.user.login.username : "Defaultname"}</h1>
        <h1> Sprint Board:</h1>
        <Controls store={appStore} />
        <Table store={appStore} />
        {/* <h1>{this.props.store.nickName}</h1>
        <h1>{this.props.store.age}</h1>
        <button onClick={this.handleDecrement}>-1</button>
        <button onClick={this.handleIncrement}>+1</button>
        <hr />
        <ul>
          {todos.map(({ text }) => {
            return <li key={text}>{text}</li>;
          })}
        </ul> */}
      </div>
    );
  }
}

const App = observer(({ store }) => {
  // return <Counter store={store} />;
  console.log("store.user", store.user);
  return (
    <div>
      <button onClick={store.getUser}>get user</button>
      <h1>{store.user ? store.user.login.username : "Defaultname"}</h1>
      <h1>Sprint Board</h1>
      <Controls store={store} />
      <Table store={store} />
    </div>
  );
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App store={appStore} />
  </>
  // <React.StrictMode>
  // {/* <DevTools /> */}
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// todos.push({ text: "text 3" });
