const path = require('path');
const extend = require('util')._extend;

const development = require('./env');

const notifier = {
  service: 'postmark',
  APN: false,
  email: true, // true
  actions: ['comment'],
  key: 'POSTMARK_KEY'
};

const defaults = {
  root: path.join(__dirname, '..'),
  notifier: notifier
};

/**
 * Expose
 */

module.exports = {
  development: extend(development, defaults)
}[process.env.NODE_ENV || 'development'];