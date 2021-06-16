export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export const formattedDateNow = () => {
  return formatDate(new Date());
};

export const formattedDateOneWeekAgo = () => {
  let aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);

  return formatDate(aWeekAgo);
};
