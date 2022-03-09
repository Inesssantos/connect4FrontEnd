import { Component, OnInit, OnDestroy, ElementRef, ViewChild, } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { FriendService } from 'app/_services/friend.service';
import { AccountService } from 'app/_services/account.service';
import { ChatService } from 'app/_services/chat.service';
import { NotificationService } from 'app/_services/notification.service';
import { SocketIOService } from 'app/_services/socket.io.services';

import { environment } from 'environments/environment';
import { Friend } from 'app/_models/friend';
import { Message } from 'app/_models/message';
import { MyNotification } from 'app/_models/notification';

import * as moment from 'moment';

@Component({
  selector: 'chat-cmp',
  templateUrl: 'chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatScroll') private myScrollContainer: ElementRef;
  isConnected: boolean = false;

  friendsOnline = [];

  id: string;

  //Conversation Selected
  conversationId: string;
  user: Friend = new Friend;
  friendSelected: Friend;
  messages: Message[] = new Array();

  //New Message
  newMessage: Message = new Message;
  @ViewChild('message') messageText: ElementRef;

  notification : MyNotification = new MyNotification;

  constructor(private router: Router, private accountService: AccountService, private friendService: FriendService, private chatService: ChatService, private notifyService: NotificationService, private socketIOService : SocketIOService) {
  }

  ngOnInit() {
    this.id = this.accountService.userValue.id;

    this.user.avatar = this.accountService.userValue.avatar
    this.user.firstname = this.accountService.userValue.firstname
    this.user.lastname = this.accountService.userValue.lastname

    this.friendService.getFriendsOnline(this.id)
      .pipe(first())
      .subscribe(x => { this.friendsOnline = x; });

    this.socketIOService.receiveMessage().subscribe(x => {
      (x as Message).time = moment((x as Message).createdAt).fromNow()
      this.messages.push((x as Message))
    });


  }

  ngOnDestroy(){
    alert()
    this.socketIOService.leaveRoom("")
    this.socketIOService.leaveRoom(this.conversationId)
  }

  getMessages(friendId: string) {
    if(this.isConnected){
      this.socketIOService.leaveRoom(this.conversationId)
    }
    else{
      this.isConnected = true;
    }

    this.friendSelected = this.friendsOnline[this.friendsOnline.findIndex(x => x.id === friendId)]

    this.chatService.getConversation(this.id, friendId)
      .pipe(first())
      .subscribe(x => {
        this.conversationId = x.id
        // Join chatroom
        var userId = this.id
        var room = this.conversationId
        this.socketIOService.joinToRoom(userId, room);
                
        this.chatService.getMessages(x.id)
          .pipe(first())
          .subscribe(x => {
            for (var i = 0; i < x.length; i++) {
              if (moment(x[i].createdAt).startOf('hour').fromNow() == "a day ago") {
                x[i].time = moment(x[i].createdAt).add(1, 'hour').format('lll');
              }
              else {
                x[i].time = moment(x[i].createdAt).fromNow()
              }
            }

            this.messages = x;
          });
      });
  }

  sendMessage() {
    const value = this.messageText.nativeElement.value
    if (value) {
      this.newMessage.conversationId = this.conversationId
      this.newMessage.sender = this.id
      this.newMessage.text = value

      this.socketIOService.sendMessage(this.newMessage)
      
      this.notification.from = this.id;
      this.notification.to = this.friendSelected.id;
      this.notification.title = "New Message";
      this.notification.message = this.accountService.userValue.username + " sent you a message";
      this.notification.position = 2
      this.notification.type = 3
      this.notification.createdAt = new Date()

      this.socketIOService.sendNotification(this.notification);

      this.chatService.addMessage(this.newMessage).pipe(first())
        .subscribe({
          next: () => {
            this.messageText.nativeElement.value = "";
            this.scrollToBottom()
          },
          error: error => {
            this.notifyService.showWarning("Error", "Error sending message", 2)
          }
        });

    }
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    } catch (err) { 
    }
  }
}
