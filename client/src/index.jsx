import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import TopBar from './components/TopBar.jsx'
import LeftBar from './components/LeftBar.jsx'
import BodyGrid from './components/BodyGrid.jsx'
import Settings from './components/Settings.jsx'
import LogIn from './components/LogIn.jsx'
import BookClubView from './components/BookClubView.jsx';
import { bookClubs, googleBooksApiData } from '../../database/sample-data/sample.js';

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'groups',
      loggedIn: false,
      bookClubs: bookClubs,
      sampleData: googleBooksApiData.items,
      currentClub: bookClubs[0],
      currentBook: googleBooksApiData.items[0],
      groupSearchResults: [{name: '', book: {image: '', title: ''}, id: 0}],
      groupSearchQuery: '',
      user: {
        "id": 1,
        "username": "Mark Maher",
        "email": "tenkin@gmail.com",
        "createdAt": "2019-04-11T19:26:30.000Z",
        "updatedAt": "2019-04-11T19:26:30.000Z"
      },
    }
    
    this.renderMain = this.renderMain.bind(this);
    this.chooseView = this.chooseView.bind(this);
    this.chooseClub = this.chooseClub.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.getGroups = this.getGroups.bind(this);
    this.searchClubs = this.searchClubs.bind(this);
    this.handleClubSearch = this.handleClubSearch.bind(this);
    this.joinGroup = this.joinGroup.bind(this);
  }

  componentDidMount() {
    // Initial loading logic will go here
  }
  
  getGroups(userId) {
    axios.get('/groups', {
      params: {
        userId: userId
      }
    })
    .then((bookClubs) => {
      this.setState({
        bookClubs: bookClubs.data,
      })
    }).catch((err) => {
      console.error(err);
    });
  }

  renderMain () {
    const { view, bookClubs, sampleData, currentBook, currentClub } = this.state;
    if (view === 'groups') {
      return <BodyGrid chooseView={this.chooseView} chooseClub={this.chooseClub} clubs={bookClubs} books={sampleData} />
    } else if (view === 'settings') {
      return <Settings clubs={bookClubs} />
    } else if (view === 'club view') {
      return <BookClubView club={currentClub} book={currentBook} />
    }
  }

  chooseView (view) {
    this.setState({view})
  }
  
  chooseClub (club, book) {
    this.setState({
      currentClub: club,
      currentBook: book,
    })
  }

  searchClubs (query) {
    axios.get('/groups/search', {
      params: {
        query: query
      }
    })
    .then((result) => {
      const searchResults = result.data;
      this.setState({
        groupSearchResults: searchResults,
      })
    }).catch((err) => {
      console.error(err);
    });
  }

  handleClubSearch (q) {
    this.setState({
      groupSearchQuery: q,
    })
  }

  joinGroup (groupId) {
    const { user } = this.state;
    axios.patch('/groups', {
      groupId,
      userId: user.id,
    })
    .then( () => {
      this.getGroups(user.id);
    }).catch((err) => {
      console.error(err);
    });
  }
  
  handleLogIn () {
    this.getGroups(this.state.user.id);
    this.setState({loggedIn: true});
  }
  
  render() {
    const { loggedIn, bookClubs, groupSearchResults, groupSearchQuery } = this.state;  // destructure state here
    if (!loggedIn) {
      return <LogIn handleLogIn={this.handleLogIn} />
    } else {
      return (
        <div>
          <LeftBar 
            book={bookClubs.length ? bookClubs[0].book : {}}
            club={bookClubs[0]}
            />
          <TopBar 
            chooseView={this.chooseView}
            groupSearchResults={groupSearchResults}
            groupSearchQuery={groupSearchQuery}
            handleClubSearch={this.handleClubSearch}
            searchClubs={this.searchClubs}
            joinGroup={this.joinGroup}
            />
          {
            this.renderMain()
          }
        </div>
      )
    }
  }
}


ReactDOM.render(<Landing />, document.getElementById("root"));