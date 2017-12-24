import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { UserServiceProvider } from '../user-service/user-service';
import { UtilityServiceProvider } from '../utility-service/utility-service';

import { User } from '../../models/user';

@Injectable()
export class ChatServiceProvider {

  constructor(
    public afDB: AngularFireDatabase,
    public userService: UserServiceProvider,
    public utilityService: UtilityServiceProvider) {
  }

  checkRoomsLookup(roomId: string) {
    return this.afDB.list(`friendChats/`, ref => ref.orderByKey().equalTo(roomId)).snapshotChanges();
  }

  createNewChatRoom(roomId: string, fromUser: User, toUser: User, message: string) {
    let chatMeta = {};
    chatMeta[`friendChats/${roomId}/${fromUser.uid}/lastMessage`] = message;
    chatMeta[`friendChats/${roomId}/${fromUser.uid}/roomId`] = roomId;
    chatMeta[`friendChats/${roomId}/${fromUser.uid}/photoURL`] = fromUser.photoURL;
    chatMeta[`friendChats/${roomId}/${fromUser.uid}/timestamp`] = firebase.database.ServerValue.TIMESTAMP;
    chatMeta[`friendChats/${roomId}/${toUser.uid}/lastMessage`] = message;
    chatMeta[`friendChats/${roomId}/${toUser.uid}/roomId`] = roomId;
    chatMeta[`friendChats/${roomId}/${toUser.uid}/photoURL`] = toUser.photoURL;
    chatMeta[`friendChats/${roomId}/${toUser.uid}/timestamp`] = firebase.database.ServerValue.TIMESTAMP;
    chatMeta[`friendChats/${roomId}/createdAt`] = firebase.database.ServerValue.TIMESTAMP;
    // chatMeta[`${roomId}/unreadMessage`] = 1;
    chatMeta[`memberFriendChatrooms/${fromUser.uid}/${roomId}`] = toUser.uid;
    chatMeta[`memberFriendChatrooms/${toUser.uid}/${roomId}`] = fromUser.uid;
    // this.afDB.list('/').update('friendChats/', chatMeta);
    firebase.database().ref().update(chatMeta);
  }

  pushMessage(message: string, roomId: string, pusher: User, listener: User) {
    let chat = {};
    let messageObj = {
      message: message,
      timestamp: Date.now(),
      uid: pusher.uid,
      photoURL: pusher.photoURL,
      displayName: pusher.displayName
    };
    chat[`friendChats/${roomId}/${pusher.uid}/lastMessage`] = message;
    chat[`friendChats/${roomId}/${listener.uid}/lastMessage`] = message;
    chat[`friendChats/${roomId}/${pusher.uid}/timestamp`] = firebase.database.ServerValue.TIMESTAMP;
    chat[`friendChats/${roomId}/${listener.uid}/timestamp`] = firebase.database.ServerValue.TIMESTAMP;
    this.afDB.list(`/messages/${roomId}`).push(messageObj);
    firebase.database().ref().update(chat);
  }

  isUserAlreadyMemberOfRoom(roomId: string) {
    let chatRoomref$ = this.afDB.list(`memberFriendChatrooms/${this.userService.currentUserId}`, ref => ref.orderByKey().equalTo(roomId));
    let chat$ = chatRoomref$.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    return chat$;
  }

  // fetchChatRoomsKeys() {
  //   let chatRoomRef$ = this.afDB.list(`memberFriendChatrooms/${this.userService.currentUserId}`);
  //   let chat$ = chatRoomRef$.snapshotChanges().map(changes => {
  //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  //   });
  //   return chat$;
  // }

  fetchChatRoomsKeys() {
    return this.afDB.list(`memberFriendChatrooms/${this.userService.currentUserId}`).snapshotChanges();
  }

  fetchFriendChatRooms(roomId: string, uid: string) {
    // return this.afDB.object(`friendChats/${roomId}`).valueChanges();
    return this.afDB.object(`friendChats/${roomId}/${uid}`).valueChanges();
  }

  fetchChatHistory(roomId: string) {
    return this.afDB.list(`messages/${roomId}`).valueChanges();
  }

  isNewMessageArrived(roomId: string) {
    return this.afDB.list(`messages/${roomId}`).snapshotChanges(['child_added']);
  }







}
