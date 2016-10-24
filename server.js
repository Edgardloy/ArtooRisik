require('dotenv').config();

const FS = require('fs');
const JOIN = require('path').join;
const EXPRESS = require('express');
const MONGOOSE = require('mongoose');
const CONFIG = require('./config');

const MODELS = JOIN(__dirname, 'app/models');
const PORT = process.env.PORT || 3000;
const APP = EXPRESS();


module.exports = APP;
