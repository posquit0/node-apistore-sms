<div align="center">
  <a href="https://github.com/posquit0/node-apistore-sms" title="API Store SMS for Node">
    <img alt="API Store SMS for Node" src="http://www.apistore.co.kr/img/service_img/20140807101212708.png" width="220px" />
  </a>
  <br />
  <h1>API Store SMS for Node</h1>
</div>

<p align="center">
  :email: A transporter for SMS/LMS/MMS via API Store SMS Service
</p>

<div align="center">
  <a href="https://circleci.com/gh/posquit0/node-apistore-sms">
    <img alt="CircleCI" src="https://circleci.com/gh/posquit0/node-apistore-sms.svg?style=shield" />
  </a>
  <a href="https://coveralls.io/github/posquit0/node-apistore-sms">
    <img src="https://coveralls.io/repos/github/posquit0/node-apistore-sms/badge.svg" alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/apistore-sms">
    <img alt="npm version" src="https://badge.fury.io/js/apistore-sms.svg" />
  </a>
  <a href="https://www.npmjs.com/package/apistore-sms">
    <img alt="npm" src="https://img.shields.io/npm/dt/apistore-sms.svg" />
  </a>
  <a href="https://david-dm.org/posquit0/node-apistore-sms">
    <img alt="npm" src="https://img.shields.io/david/posquit0/node-apistore-sms.svg?style=flat-square" />
  </a>
  <a href="https://opensource.org/licenses/mit-license.php">
    <img alt="MIT License" src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" />
  </a>
  <a href="https://github.com/ellerbrock/open-source-badge/">
    <img alt="Open Source Love" src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" />
  </a>
</div>


<br />

**APISTORE SMS**는 [API Store](http://www.apistore.co.kr/api/apiView.do?service_seq=151)에서 제공하는 SMS API를 Node.js에서 쉽게 활용하기 위하여 작성된 클라이언트 모듈입니다.

- 이용 중 발생한 문제에 대하여 책임지지 않습니다.
- 최초 작성은 자동차 렌트 플랫폼 [CARPLAT](https://www.carplat.co.kr)에서 사용하기 위하여 작성되었습니다.


## Installation

```bash
# NPM
$ npm install --save apistore-sms
# Yarn
$ yarn add apistore-sms
```


## Usage

- 모든 메소드는 [Promise](http://www.html5rocks.com/ko/tutorials/es6/promises/)를 반환

```node
var apistore = require('apistore-sms').createClient({
  apiKey: 'YOUR_API_KEY',
  apiId: 'YOUR_ID'
});

// SMS 전송 (단일 수신자)
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

// SMS 전송 (복수 수신자)
apistore.sendSMS({
  from: '15885588', // 발신자 번호
  to: ['01012345678', '010-2345-6789'], // 수신자 번호
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

// MMS 전송
apistore.sendLMS({
  from: '15885588', // 발신자 번호
  to: '01012345678', // 수신자 번호
  text: 'Hot! Hot!', // 내용
  subject: '넘나맛있는', // 제목(optional)
  file: path.join(__dirname, 'test.jpg'), // or fs.createReadStream(filepath)
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

## Contributing

This project follows the [**Contributor Covenant**](http://contributor-covenant.org/version/1/4/) Code of Conduct.

#### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/posquit0/node-apistore-sms/issues) to report any bugs or ask feature requests.


## Contact

If you have any questions, feel free to join me at [`#posquit0` on Freenode](irc://irc.freenode.net/posquit0) and ask away. Click [here](https://kiwiirc.com/client/irc.freenode.net/posquit0) to connect.


## License

Provided under the terms of the [MIT License](https://github.com/posquit0/node-apistore-sms/blob/master/LICENSE).

Copyright © 2017, [Byungjin Park](http://www.posquit0.com).
