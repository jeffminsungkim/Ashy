import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { UserServiceProvider } from '../user-service/user-service';
import { UtilityServiceProvider } from '../utility-service/utility-service';

import { User } from '../../models/user';

@Injectable()
export class ChatServiceProvider {

  private toId: any;

  constructor(
    private afDB: AngularFireDatabase,
    private userService: UserServiceProvider,
    private utilityService: UtilityServiceProvider) {
  }

  checkRoomsLookup(roomId: string) {
    return this.afDB.list(`friendChats/`, ref => ref.orderByKey().equalTo(roomId)).snapshotChanges();
  }

  createNewChatRoom(pusher: User, listener: User, message: string) {
    const roomId = this.utilityService.combineUserIdsToGenerateHashKey(pusher.uid, listener.uid);
    let chatMeta = {};
    chatMeta[`friendChats/${roomId}/${pusher.uid}/lastMessage`] = message;
    chatMeta[`friendChats/${roomId}/${pusher.uid}/photoURL`] = pusher.photoURL;
    chatMeta[`friendChats/${roomId}/${pusher.uid}/timestamp`] = Date.now();
    chatMeta[`friendChats/${roomId}/${listener.uid}/lastMessage`] = message;
    chatMeta[`friendChats/${roomId}/${listener.uid}/photoURL`] = listener.photoURL;
    chatMeta[`friendChats/${roomId}/${listener.uid}/timestamp`] = Date.now();
    // chatMeta[`${roomId}/unreadMessage`] = 1;
    chatMeta[`memberFriendChatrooms/${pusher.uid}/${roomId}`] = listener.uid;
    chatMeta[`memberFriendChatrooms/${listener.uid}/${roomId}`] = pusher.uid;
    // this.afDB.list('/').update('friendChats/', chatMeta);
    firebase.database().ref().update(chatMeta);
  }

  pushNewMessage(pusher: User, listener: User, message: string) {
    const roomId = this.utilityService.combineUserIdsToGenerateHashKey(pusher.uid, listener.uid);
    let chat = {};
    chat[`${roomId}/${this.userService.currentUserId}/message`] = message;
    chat[`${roomId}/${pusher.uid}/displayName`] = pusher.displayName;
    chat[`${roomId}/${pusher.uid}/photoURL`] = pusher.photoURL;
    chat[`${roomId}/${pusher.uid}/timestamp`] = Date.now();  
    chat[`${roomId}/${listener.uid}/displayName`] = listener.displayName;
    chat[`${roomId}/${listener.uid}/photoURL`] = listener.photoURL;
    chat[`${roomId}/${listener.uid}/timestamp`] = Date.now();
    this.afDB.list('/').update('messages/', chat);

  }

  pushMessage(message: string, roomId: string, pusher: User, listener: User) {
    let chat = {};
    chat[`messages/${roomId}/${this.userService.currentUserId}/message`] = message;
    chat[`messages/${roomId}/${this.userService.currentUserId}/timestamp`] = Date.now();
    chat[`friendChats/${roomId}/${pusher.uid}/lastMessage`] = message;
    chat[`friendChats/${roomId}/${listener.uid}/lastMessage`] = message;
    chat[`friendChats/${roomId}/${pusher.uid}/timestamp`] = Date.now();
    chat[`friendChats/${roomId}/${listener.uid}/timestamp`] = Date.now();
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








}
