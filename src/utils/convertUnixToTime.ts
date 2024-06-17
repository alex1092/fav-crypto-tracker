export function convertUnixToTime(unixTimestamp: number) {
  let date = new Date(unixTimestamp * 1000);

  let formattedTime = date.toLocaleString();

  return formattedTime;
}
