// import axios from 'axios';
// import React, { PropTypes } from 'react';
// import { dispatch, connect } from 'react-redux';
// import ReactDOM from 'react-dom';
// import SideBar from '../lib/SideBar-modified.js';
// import Nav from './nav.js';
// import PrimaryChatroom from './PrimaryChatroom.js';
// import LeftSideBar from './LeftSideBar.js';
// import RightSideBar from './RightSideBar.js';
// import { addMessageFromSocket, addMessageFromDB } from '../actions/ChatActions';
// import { addRoom } from '../actions/RoomActions';
// import { addDMRoom } from '../actions/DMRoomActions';
// import { addUser, toggleOnlineUser, toggleOfflineUser, downloadOnlineUsers } from '../actions/UserActions';
// import { setCurrentUser } from '../actions/CurrentUserActions';
// import { setCurrentRoom } from '../actions/CurrentRoomActions';

// class AppContainer extends React.Component {

//   constructor(props) {
//     super(props);
//     this.socket = io('/Hack-Reactor-NameSpace');
//     this.state = {
//       barOpened: false,
//       duration: 150,
//       mode: 'over',
//       side: 'right',
//       size: 256,
//       tolerance: 70
//     }
//     this.downloadAllChannels = this.downloadAllChannels.bind(this);
//   }

//   toggleBar() { this.setState({ barOpened: !this.state.barOpened })}
//   onOpen() { this.setState({ barOpened: true })}
//   onClose() { this.setState({ barOpened: false })}

//   componentDidMount() {
//     this.downloadAllChannels();
//     this.downloadAllUsers();
//     this.downloadAllDMRooms();
//     this.socket.on("getAllLoggedInUsersFromSocket", onlineUsersObj => {
//       console.log("TRYING TO GET A MESSAGE")
//       console.log("online users Obj",onlineUsersObj)
//       console.log("online users Obj keys",Object.keys(onlineUsersObj))
//       if(Object.keys(onlineUsersObj).length > 0){
//         Object.keys(onlineUsersObj).forEach( (email) =>
//           this.handleReceive(downloadOnlineUsers,email)
//         );
//       }
//     });
//     this.socket.on('chat message', 
//       incoming => {
//         console.log("CHAT MESSAGE", incoming)
//         this.handleReceive(addMessageFromSocket,{
//           channelName: incoming.channelName,
//           channelID: incoming.channelID,
//           username: incoming.username,
//           text: incoming.text,
//           url: incoming.url,
//         });
//         // console.log("incoming.text",incoming.text);
//         // window.alert("incoming.text",incoming.text);
//       }
//     );
//     this.socket.on('disconnected', txt => this.handleReceive(addMessageFromSocket,{text: txt}) );
//     this.socket.on('onlineToggle ON', email => {
//       console.log("who just logged in",email);
//       this.handleReceive(toggleOnlineUser,email);
//     });
//     this.socket.on('onlineToggle OFF', email => {
//       console.log("who just logged off",email);
//       this.handleReceive(toggleOfflineUser,email);
//     });
//     this.socket.on('someoneJoin', txt => this.handleReceive(addMessageFromSocket,{text: txt}) );
//     this.socket.on("direct message", incoming => {
//       // console.log("trying to get a room", incoming.room);
//       window.alert(incoming.msg)
//       this.socket.emit('changeRoom', incoming.room)
//       this.handleReceive(setCurrentRoom,incoming.room);
//     });
//     this.socket.on('connect', (txt) => {
//       this.socket.emit('changeRoom', this.props.currentRoom.channelName);
//       // console.log(this.props.currentUser.username,"WHO AM I???? AppContainer line 83")
//       this.socket.emit("getAllLoggedInUsersFromSocket")
//     }); 
//   }
  
//   handleReceive(cb,body) {
//     this.props.dispatch(cb(body));
//   }

//   downloadAllChannels() {
//     this.currentRoom = this.props.currentRoom.channelName;
//     axios.get('/db/channels')
//     .then( (res) => {
//       res.data.forEach( (msg) => {
//         let eachRoom = {
//           id: msg.id,
//           channelName: msg.name,
//           currentRoomToggle: (this.currentRoom === msg.name)
//         }
//         this.handleReceive(addRoom,eachRoom);
//         if(this.currentRoom === msg.name){
//           this.handleReceive(setCurrentRoom,eachRoom);
//         }
//       });
//     });
//   }

//   downloadAllUsers() {
//     //get from server who current user is
//     // { dispatch } = this.props.dispatch;
//     this.currentUserIDfromDB;
//     axios.get('/db/getMe', { headers: { "authorization": "Bearer " + localStorage.getItem('id_token')}})
//     .then(res => {
//       this.props.dispatch(setCurrentUser(res.data));
//       // console.log('supposedly set the curretUser ',this.props.currentUser);
//       //now download all users
//       axios.get('/db/users')
//       .then( (resp) => {
//         // console.log("what comes in from the DB?",resp)
//         resp.data.forEach( (person) => {
//           // console.log(person.phone, "this is the persons phone number")
//           let eachUser = {
//             id: person.id,
//             username: person.username,
//             email: person.email,
//             about: person.about,
//             first: person.first,
//             last: person.last,
//             github: person.github,
//             facebook: person.facebook,
//             twitter: person.twitter,
//             linkedin: person.linkedin,
//             onlineToggle: false
//           }
//           this.handleReceive(addUser,eachUser);
//           // if(this.currentUserIDfromDB === person.id){
//           //   this.handleReceive(setCurrentUser,eachUser);
//           // }
//         });
//         // console.log("email email email???",this.props.currentUser.email);
//         this.socket.emit("setMyEmailInSocket",{
//           email: this.props.currentUser.email,
//           username: this.props.currentUser.username
//         });
//         this.socket.emit("someoneJoin",this.props.currentUser.username);
//       });
//     });
//   }

//   downloadAllDMRooms(){
//     //get from server who current user is
//     this.currentUserIDfromDB;
//     axios.get('/db/getMe',
//     { headers: { "authorization": "Bearer "+localStorage.getItem('id_token') }})
//     .then( (res) => {
//       // console.log("who is my user???",res.data)
//       this.currentUserIDfromDB = res.data.id;
//       axios.get('/db/DMRooms')
//       .then( (res) => {
//         // console.log("what are the DM rooms that are downloaded",res.data)
//         res.data.forEach( (msg) => {
//           let eachRoom = {
//             id: msg.id,
//             user1ID: msg.user1ID,
//             user2ID: msg.user2ID,
//             user1username: msg.user1,
//             user2username: msg.user2,
//             channelName: msg.channelName,
//             aliasName: msg.aliasName,
//             currentRoomToggle: (this.currentRoom === msg.channelName)
//           } 
//           // console.log(this.currentUserIDfromDB, "   ", eachRoom.user1ID, "   ", eachRoom.user2ID)
//           if(this.currentUserIDfromDB === eachRoom.user1ID || this.currentUserIDfromDB === eachRoom.user2ID){
//             this.handleReceive(addDMRoom,eachRoom);
//           }
//         });
//       });
//     });
//   } //end of downloadAllRooms

//   render() {
//     const { barOpened, duration, mode, side, size } = this.state;
//     const navIconClassName = [ 'nav-icon' ];

//     if (barOpened) { navIconClassName.push('open'); }

//     const bar = (<div className='side'><RightSideBar theSocket={this.socket} /></div>);

//     const sideBarProps = {
//       bar: bar,
//       mode: mode,
//       opened: barOpened,
//       onOpen: this.onOpen.bind(this),
//       onClose: this.onClose.bind(this),
//       side: side
//     };

//     return (
//       <SideBar {...sideBarProps}>
//         <Nav />
//         <div>

//             <div onClick={this.toggleBar.bind(this)}>Show Active Members</div>
//             <input
//               onChange={this.toggleBar.bind(this)}
//               type='checkbox'
//               checked={barOpened} />


//           <table>
//             <td><LeftSideBar downloadAllChannels={this.downloadAllChannels} theSocket={this.socket} /></td>
//             <td><PrimaryChatroom theSocket={this.socket} /></td>
//           </table>          

//         </div>
//       </SideBar>
//     );
//   }
// }

// const mapStateToProps = (state, ownProps) => {
//   // console.log("current room",state.allReducers.CurrentRoomReducer)
//   return { 
//     rooms: state.allReducers.RoomReducer,
//     currentUser: state.allReducers.CurrentUserReducer,
//     DMRooms: state.allReducers.DMRoomReducer,
//     currentRoom: state.allReducers.CurrentRoomReducer
//   }
// };

// export default connect(mapStateToProps)(AppContainer);