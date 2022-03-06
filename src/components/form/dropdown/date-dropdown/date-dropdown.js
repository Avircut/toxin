import {DateRangePicker,Datepicker} from "vanillajs-datepicker";
const dateDropdowns = document.querySelectorAll('.date-dropdown');
console.log(dateDropdowns);
dateDropdowns.forEach((dropdown) => {
  Datepicker.locales.ru = {
    days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
    daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    today: "Сегодня",
    clear: "Очистить",
    format: "dd.mm.yyyy",
    weekStart: 1,
    monthsTitle: 'Месяцы'
  }
  let dateRangePicker = new DateRangePicker(dropdown,{clearBtn:true, prevArrow:'arrow_back',nextArrow:'arrow_forward',todayHighlight:true});
  let inputs = dropdown.querySelectorAll('input');
  let texts = dropdown.querySelectorAll('summary');

  dateRangePicker.datepickers[0].config.language='ru';
  console.log(dateRangePicker)
  inputs.forEach( (el,index) => {
    inputs[index].addEventListener('changeDate', () => {
      let dates =dateRangePicker.getDates('dd.mm.y');
      if(dates[index]!=undefined) texts[index].innerHTML = dates[index];  
      dateRangePicker.datepickers.forEach((el) => {
        let datepicker = el.picker.element;
        let oldRangeCells = datepicker.querySelectorAll('.range-bg');
        oldRangeCells.forEach((el) => {
          el.classList.remove('range-bg');  
        })
        let newRangeCells = datepicker.querySelectorAll('.range,.range-end,.range-start');
        if (newRangeCells.length>2){
          newRangeCells.forEach((el) => {
            el.classList.add('range-bg');
          })
        }
      })
    })
  });
})