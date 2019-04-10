import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TopBar from './components/TopBar.jsx'
import LeftBar from './components/LeftBar.jsx'
import BodyGrid from './components/BodyGrid.jsx'
import Settings from './components/Settings.jsx'
import LogIn from './components/LogIn.jsx'

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'groups',
      loggedIn: false,
    }

    this.renderMain = this.renderMain.bind(this);
    this.chooseView = this.chooseView.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
  }

  componentDidMount() {
    // Initial loading logic will go here
  }

  renderMain () {
    const { view } = this.state;
    if (view === 'groups') {
      return <BodyGrid />
    } else if (view === 'settings') {
      return <Settings />
    }
  }

  chooseView (view) {
    this.setState({view})
  }

  handleLogIn (googleResponse) {
    this.setState({loggedIn: true});
    console.log(googleResponse);
  }

  render() {
    const {loggedIn } = this.state;  // destructure state here
    if (!loggedIn) {
      return <LogIn handleLogIn={this.handleLogIn} />
    } else {
      return (
      <div>
        <LeftBar />
        <TopBar chooseView={this.chooseView} />
        {
          this.renderMain()
        }
      </div>
      )
      // Nav bar
        // logo
        // butttons
      // Side bar
        // Next meeting component
      // Groups view
        // Individual groups
        // add new group button
    }
  }
}

ReactDOM.render(<Landing />, document.getElementById("root"));