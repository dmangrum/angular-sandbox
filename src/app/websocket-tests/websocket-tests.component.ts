import { Component, OnInit } from '@angular/core';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';

@Component({
  selector: 'app-websocket-tests',
  templateUrl: './websocket-tests.component.html',
  styleUrls: ['./websocket-tests.component.css']
})
export class WebsocketTestsComponent implements OnInit {

  // private readonly sbEndPoint: string =
  //   'sb://dcp-geotab-dev.servicebus.windows.net/;' +
  //   'SharedAccessKeyName=RootManageSharedAccessKey;' +
  //   'SharedAccessKey=aRPSdJLQ8aeb3QukhPHRN53uNskZzuBLPSPfVDTuzZw=';

  // private readonly sbEndPoint: string = 'https://sigr-chat-on-waws.xxxx.net/signalr/connect?transport=webSockets';

  private readonly sbEndPoint: string = 'ws://demos.kaazing.com/echo';

  constructor() { }

  ngOnInit() {
    // connect
    const webSocket = new $WebSocket(this.sbEndPoint);
    console.log('web socket', webSocket);
    // you can send immediately after connect,
    // data will cached until connect open and immediately send or connect fail.

    // when connect fail, websocket will reconnect or not,
    // you can set {WebSocketConfig.reconnectIfNotNormalClose = true} to enable auto reconnect
    // all cached data will lost when connect close if not reconnect


    // set received message callback
    webSocket.onMessage(
      (msg: MessageEvent) => {
        console.log('onMessage ', msg.data);
      },
      { autoApply: false }
    );

    // set received message stream
    webSocket.getDataStream().subscribe(
      (msg) => {
        console.log('next', msg.data);
        webSocket.close(false);
      },
      (msg) => {
        console.log('error', msg);
      },
      () => {
        console.log('complete');
      }
    );

    const data = 'hello world';

    // send with default send mode (now default send mode is Observer)
    webSocket.send(data).subscribe(
      (msg) => {
        console.log('next', msg.data);
      },
      (msg) => {
        console.log('error', msg);
      },
      () => {
        console.log('complete');
      }
    );

    webSocket.send('by default, this will never be sent, because Observer is cold.');
    webSocket.send('by default, this will be sent, because Observer is hot.').publish().connect();

    // webSocket  .setSendMode(WebSocketSendMode.Direct);
    webSocket.setSend4Mode(WebSocketSendMode.Direct);
    webSocket.send('this will be sent Direct, because send mode is set to Direct.');


    webSocket.send('this will be sent and return Promise.', WebSocketSendMode.Promise).then(
      (T) => {
        console.log('is send');
      },
      (T) => {
        console.log('not send');
      }
    );

    webSocket.send('this will be sent and return Observer.').subscribe(
      (msg) => {
        console.log('next', msg.data);
      },
      (msg) => {
        console.log('error', msg);
      },
      () => {
        console.log('complete');
      }
    );

    webSocket.close(false);    // close
    webSocket.close(true);    // close immediately

  }
}
