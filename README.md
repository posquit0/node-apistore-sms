<img src="http://www.apistore.co.kr/img/service_img/20140807101212708.png" align="left" width="128px" height="128px"/>

### **API Store SMS for Node**
> *A transporter for SMS/LMS/MMS via API Store SMS service*

[![npm version](https://badge.fury.io/js/apistore-sms.svg)](https://badge.fury.io/js/apistore-sms)


<br />

[**APIStore-SMS**](https://github.com/posquit0/node-apistore-sms)는 [API Store](http://www.apistore.co.kr/api/apiView.do?service_seq=151)에서 제공하는 SMS API를 Node.js에서 쉽게 활용하기 위하여 작성된 클라이언트 모듈입니다.

## <a name="installation">Installation

```bash
$ npm install apistore-sms
```


## <a name="usage">Usage

- 모든 메소드는 [Promise](http://www.html5rocks.com/ko/tutorials/es6/promises/)를 반환

```node
var apistore = require('apistore-sms').createClient({
  apiKey: 'YOUR_API_KEY',
  apiId: 'YOUR_ID'
});

// SMS 전송
apistore.sendSMS({
  from: '15885588', // 발신자 번호
  to: '01012345678', // 수신자 번호
  text: 'Hot! Hot!', // 내용
  subject: '넘나맛있는', // 제목(optional)
  at: '20160801235959', // 예약시간(optional)
  author: 'Pizza Huuut' // 발신자 이름(optional)
}).then(function (cmid) {
  console.log(cmid); // 메시지 아이디
}).catch(function (error) {
  console.log(error);
});

// LMS 전송
apistore.sendLMS({
  from: '15885588', // 발신자 번호
  to: '01012345678', // 수신자 번호
  text: 'Hot! Hot!', // 내용
  subject: '넘나맛있는', // 제목(optional)
  at: '20160801235959', // 예약시간(optional)
  author: 'Pizza Huuut' // 발신자 이름(optional)
}).then(function (cmid) {
  console.log(cmid); // 메시지 아이디
}).catch(function (error) {
  console.log(error);
});

// MMS 전송 (Not yet implemented to send file)
apistore.sendLMS({
  from: '15885588', // 발신자 번호
  to: '01012345678', // 수신자 번호
  text: 'Hot! Hot!', // 내용
  subject: '넘나맛있는', // 제목(optional)
  file: 'multipart/form-data',
  at: '20160801235959', // 예약시간(optional)
  author: 'Pizza Huuut' // 발신자 이름(optional)
}).then(function (cmid) {
  console.log(cmid); // 메시지 아이디
}).catch(function (error) {
  console.log(error);
});

// Report 보기
apistore.getReport('your_cmid')
  .then(function (result) {
    console.log(result);
  }).catch(function (error) {
    console.log(error);
  });
```


## <a name="contact">Contact

If you have any questions, feel free to join me at [`#posquit0` on Freenode](irc://irc.freenode.net/posquit0) and ask away. Click [here](https://kiwiirc.com/client/irc.freenode.net/posquit0) to connect.


## <a name="license">License

- Claud D. Park <posquit0.bj@gmail.com>
- [MIT Liense](https://github.com/posquit0/node-apistore-sms/blob/master/LICENSE)
