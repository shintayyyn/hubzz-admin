import Vue from 'vue'
import moment from 'moment'

Vue.filter('localDate', function (date, dateOnly) {
  if (dateOnly) {
    return `${moment(date).format('L')}`
  }
  if (date) {
    return `${moment(date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY')} | ${moment(date, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('HH:mm')}`
  }
})
Vue.filter('currency', function (number) {
  if (number) {
    return number.toFixed(2);
  }
  return '0.00'
})

Vue.filter('StringMaxLength', function (str, numLength) {
  if (str) {
    return str.length > numLength ? `${str.substring(0, numLength)}..` : str
  }
})

Vue.filter('hoursMinutes', function (num) {
  let hours = Math.floor(num / 60)
  let minutes = Math.floor(num % 60)
  let hrDisplay = `${hours > 0 ? `${hours} Hour${hours > 1 ? 's' : ''}` : ''}`
  let minDisplay = `${minutes > 0 ? `${minutes} Minute${minutes > 1 ? 's' : ""}` : ''}`
  return `${hrDisplay} ${minDisplay}`
})

