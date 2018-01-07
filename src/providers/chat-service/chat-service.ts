import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { UserServiceProvider } from '@ashy-services/user-service/user-service';
import { UtilityServiceProvider } from '@ashy-services/utility-service/utility-service';
import { User } from '@ashy-models/user';

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
    chatMeta[`memberFriendChatrooms/${fromUser.uid}/${roomId}`] = toUser.uid;
    chatMeta[`memberFriendChatrooms/${toUser.uid}/${roomId}`] = fromUser.uid;
    chatMeta[`friendChatrooms/${roomId}/createdAt`] = firebase.database.ServerValue.TIMESTAMP;
    // this.afDB.list('/').update('friendChats/', chatMeta);
    firebase.database().ref().update(chatMeta);
  }

  pushMessage(message: string, roomId: string, fromUser: User, toUser: User) {
    let chat = {};
    let messageObj = {
      message: message,
      timestamp: Date.now(),
      uid: fromUser.uid,
      photoURL: fromUser.photoURL,
      displayName: fromUser.displayName
    };
    chat[`friendChats/${roomId}/${fromUser.uid}/roomId`] = roomId;
    chat[`friendChats/${roomId}/${fromUser.uid}/uid`] = fromUser.uid;
    chat[`friendChats/${roomId}/${fromUser.uid}/displayName`] = fromUser.displayName;
    chat[`friendChats/${roomId}/${fromUser.uid}/photoURL`] = fromUser.photoURL;
    chat[`friendChats/${roomId}/${fromUser.uid}/lastMessage`] = message;
    chat[`friendChats/${roomId}/${fromUser.uid}/timestamp`] = firebase.database.ServerValue.TIMESTAMP;

    chat[`friendChats/${roomId}/${toUser.uid}/roomId`] = roomId;
    chat[`friendChats/${roomId}/${toUser.uid}/uid`] = toUser.uid;
    chat[`friendChats/${roomId}/${toUser.uid}/displayName`] = toUser.displayName;
    chat[`friendChats/${roomId}/${toUser.uid}/photoURL`] = toUser.photoURL;
    chat[`friendChats/${roomId}/${toUser.uid}/lastMessage`] = message;
    chat[`friendChats/${roomId}/${toUser.uid}/timestamp`] = firebase.database.ServerValue.TIMESTAMP;

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

  isMemberOfRoomId() {
    return this.afDB.list(`memberFriendChatrooms/${this.userService.currentUserId}`).snapshotChanges(['child_removed']);
  }

  removeFriendChat(roomId: string, toUserId: string) {
    let friendChat = {};
    friendChat[`friendChats/${roomId}/${toUserId}`] = null;
    firebase.database().ref().update(friendChat);
  }







}
