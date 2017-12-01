'use strict';

const _ = require('lodash');
const axios = require('axios');
const debug = require('debug')('apistore-sms');
const fs = require('fs');
const moment = require('moment');


const APISTORE_SMS_BASE_URL = 'http://api.apistore.co.kr/ppurio/1/message';

function checkRequired(requiredList, form) {
  if (_.isEmpty(requiredList)) return true;

  for (let i = 0; i < requiredList.length; i++)
    if (!(requiredList[i] in form)) return false;

  return true;
}

/**
 * SMS Agent of API Store SMS Service
 */
class SmsAgent {
  /**
   * Create a new SmsAgent instance.
   *
   * @param {Object} options={} - The optional configurations.
   */
  constructor(options = {}) {
    debug('create an instance');
    this.options = Object.assign({
      baseUrl: APISTORE_SMS_BASE_URL,
      timeout: 1000 * 30
    }, options);

    if (typeof this.options.apiId !== 'string')
      throw new TypeError('`apiId` is needed.');

    if (typeof this.options.apiKey !== 'string')
      throw new TypeError('`apiKey` is needed.');

    this.client = axios.create({
      baseURL: this.options.baseUrl,
      timeout: this.options.timeout,
      headers: {
        'User-Agent': 'Node.js APISTORE-SMS Agent',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-waple-authorization': this.options.apiKey
      },
      transformRequest: [(data) => {
        const serialized = Object.entries(data)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
        return serialized.join('&');
      }]
    });
  }

  request(spec, form) {
    const { path, requiredBody } = spec;
    const url = `${path}/${this.options.apiId}`;

    if (!checkRequired(requiredBody, form))
      return Promise.reject(new Error('Required body: ' + requiredBody));

    const data = this.convertForm(form);

    return this.client.post(url, data)
      .then(res => {
        if ('result_code' in res.data) {
          if (res.data['result_code'] !== '200')
            throw new Error('Failed request');
          return res.data['cmid'];
        } else {
          if (_.isInteger(res.data['call_status']))
            return res.data;
          throw new Error('Failed request');
        }
      })
      .catch(() => {
        throw new Error('Failed request');
      });
  }

  convertForm(form = {}) {
    const {
      from, to, text, subject,
      author, cmid, at, file
    } = form;

    const data = {};
    data['send_phone'] = from;
    data['dest_phone'] = Array.isArray(to) ? _.join(to, ',') : to;
    data['msg_body'] = text;

    if (at instanceof Date)
      data['send_time'] = moment(at).format('YYYYMMDDHHmmss');
    else if (typeof at === 'string')
      data['send_time'] = at;

    // form.file should be a stream or a filepath.
    // ex) form.file = fs.createReadStream('./example.jpg')
    if (file) {
      if (typeof file === 'string')
        data['file'] = fs.createReadStream(file);
      else
        data['file'] = file;
    }

    if (subject)
      data['subject'] = subject;
    if (author)
      data['send_name'] = author;
    if (cmid)
      data['cmid'] = cmid;

    return data;
  }

  sendSMS(form = {}) {
    const spec = {
      method: 'POST',
      path: '/sms',
      requiredBody: [
        'from', 'to', 'text'
      ]
    };

    return this.request(spec, form);
  }

  sendLMS(form = {}) {
    const spec = {
      method: 'POST',
      path: '/lms',
      requiredBody: [
        'from', 'to', 'text'
      ]
    };

    return this.request(spec, form);
  }

  sendMMS(form = {}) {
    const spec = {
      method: 'POST',
      path: '/mms',
      requiredBody: [
        'from', 'to'
      ]
    };

    return this.request(spec, form);
  }

  getReport(cmid, form = {}) {
    const spec = {
      method: 'POST',
      path: '/report'
    };
    form.cmid = cmid;

    return this.request(spec, form);
  }
}

module.exports = SmsAgent;
