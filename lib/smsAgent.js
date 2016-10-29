/*
 * API Store SMS
 *
 * Author:
 * Claud D. Park <posquit0.bj@gmail.com>
 * http://www.posquit0.com
 *
 * MIT License
 */

'use strict';

/**
 * Module dependencies
 */
var fs = require('fs');
var _ = require('lodash');
var r = require('request-promise');
var moment = require('moment');

var APISTORE_SMS_HOST = 'http://api.apistore.co.kr/ppurio/1/message';


function checkRequired(requiredList, form) {
  if (_.isEmpty(requiredList)) return true;

  for (var i = 0; i < requiredList.length; i++)
    if (!(requiredList[ i ] in form)) return false;

  return true;
}

function formatPath(path, params) {
  return _.map(path, function (p) {
    return p[ 0 ] === ':' ? params[ p.slice(1) ] : p;
  });
}

/**
 * Creates a client for Iamport REST API.
 *
 */
function SmsAgent(options) {
  if (!(this instanceof SmsAgent)) {
    return new SmsAgent(options);
  }

  if (_.isEmpty(options) || !options.hasOwnProperty('apiKey')
    || !options.hasOwnProperty('apiId'))
    throw new Error('\'apiKey\' and \'apiId\' are needed!');

  this._options = {
    host: options.host || APISTORE_SMS_HOST,
    apiKey: options.apiKey,
    apiId: options.apiId
  };
}

SmsAgent.prototype._buildUri = function (path) {
  var host = this._options.host;
  var apiId = this._options.apiId;
  return _.join([host].concat(path).concat(apiId), '/');
};

SmsAgent.prototype._makeRequest = function (spec, form) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    if (!checkRequired(spec.requiredParams, form))
      return reject(new Error('Required parameters: ' + spec.requiredParams));

    if (!checkRequired(spec.requiredBody, form))
      return reject(new Error('Required body: ' + spec.requiredBody));

    var path = formatPath(
      spec.path, _.pick(form, spec.requiredParams)
    );

    var headers = {
      'User-Agent': 'Node.js SmsAgent',
      'x-waple-authorization': _this._options.apiKey
    };

    var queryOptions = {
      uri: _this._buildUri(path),
      method: spec.method,
      headers: headers,
      encoding: 'utf8',
      json: true
    };

    if (spec.method === 'GET')
      queryOptions.qs = _this._convertForm(form);
    else
      queryOptions.formData = _this._convertForm(form);

    r(queryOptions)
      .then(function (res) {
        if ('result_code' in res) {
          if (res[ 'result_code' ] !== '200')
            reject(new Error('Failed request'));
          else
            resolve(res[ 'cmid' ]);
        } else {
          if (_.isInteger(res[ 'call_status' ]))
            resolve(res);
          else
            reject(new Error('Failed request'));
        }
      })
      .catch(function () {
        reject(new Error('Failed request'));
      });
  });
};

SmsAgent.prototype._convertForm = function (form) {
  if (_.isEmpty(form)) return {};

  var newForm = {};

  if (form.to) {
    var to = _.isArray(form.to) ? _.join(form.to, ',') : form.to;
    newForm[ 'dest_phone' ] = to;
  }

  if (form.at) {
    var at = form.at instanceof Date
      ? moment(at).format('YYYYMMDDHHmmss')
      : form.at;
    newForm[ 'send_time' ] = at;
  }

  // form.file should be a stream or a filepath.
  // ex) form.file = fs.createReadStream('./example.jpg')
  if (form.file) {
    if (typeof form.file === 'string')
      newForm[ 'file' ] = fs.createReadStream(form.file);
    else
      newForm[ 'file' ] = form.file;
  }

  if (form.from) newForm[ 'send_phone' ] = form.from;
  if (form.text) newForm[ 'msg_body' ] = form.text;
  if (form.subject) newForm[ 'subject' ] = form.subject;
  if (form.author) newForm[ 'send_name' ] = form.author;
  if (form.cmid) newForm[ 'cmid' ] = form.cmid;

  return newForm;
};

SmsAgent.prototype.sendSMS = function (form) {
  var spec = {
    method: 'POST',
    path: ['sms'],
    requiredBody: [
      'from', 'to', 'text'
    ]
  };

  return this._makeRequest(spec, form);
};

SmsAgent.prototype.sendLMS = function (form) {
  var spec = {
    method: 'POST',
    path: ['lms'],
    requiredBody: [
      'from', 'to', 'text'
    ]
  };

  return this._makeRequest(spec, form);
};

SmsAgent.prototype.sendMMS = function (form) {
  var spec = {
    method: 'POST',
    path: ['mms'],
    requiredBody: [
      'from', 'to'
    ]
  };

  return this._makeRequest(spec, form);
};

SmsAgent.prototype.getReport = function (cmid, form) {
  var spec = {
    method: 'POST',
    path: ['report']
  };
  var _form = _.merge({ 'cmid': cmid }, form);

  return this._makeRequest(spec, _form);
};

module.exports = {
  createClient: SmsAgent
};
