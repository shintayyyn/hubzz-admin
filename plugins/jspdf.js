import jsPDF from 'jspdf'

export default (ctx, inject) => {
  ctx.$jsPDF = jsPDF

  inject('jsPDF', jsPDF)
}