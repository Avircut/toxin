import IMask from 'imask';
// https://github.com/text-mask/text-mask 
// Assuming you have an input element in your HTML with the class .myInput
let textField = document.querySelector('.masked>.text-field');
var dateMask = IMask(textField, {
  mask: Date,  // enable date mask

  // other options are optional
  pattern:'d{.}`m{.}`Y',// Pattern mask with defined blocks, default is 'd{.}`m{.}`Y'
  // you can provide your own blocks definitions, default blocks for date mask are:
  blocks: {
    d: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 31,
      maxLength: 2,
    },
    m: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
      maxLength: 2,
    },
    Y: {
      mask: IMask.MaskedRange,
      from: 1900,
      to: 9999,
    }
  },
  // define date -> str convertion
  format: function (date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    return [day, month, year].join('.');
  },
  // define str -> date convertion
  parse: function (str) {
    var yearMonthDay = str.split('.');
    return new Date(yearMonthDay[2], yearMonthDay[1] - 1, yearMonthDay[0]);
  },

  // optional interval options
  min: new Date(1970, 0, 1),  // defaults to `1900-01-01`
  max: new Date(2100, 0, 1),  // defaults to `9999-01-01`

  autofix: 'pad',  // defaults to `false`, see details

  // also Pattern options can be set
  lazy: true,

  // and other common options
  overwrite: true  // defaults to `false`
});