/* eslint-disable */

function toReadableTime(time) {
  const getStr = (num) => `${Math.floor(num)}`.padStart(2, 0);
  const h = getStr((time / 1000 / 60 / 60) % 24);
  const m = getStr((time / 1000 / 60) % 60);
  const s = getStr((time / 1000) % 60);
  const ms = `${Math.floor(time % 1000)}`.padStart(3, 0);
  return `${h}:${m}:${s}.${ms}`;
}

const main = async () => {
  const response = await fetch('uptime');
  const uptime = await response.text();
  document.body.append(`Uptime: ${toReadableTime(uptime * 1000)}`);
};

main().catch((e) => console.log(e.message));
