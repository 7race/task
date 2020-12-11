/*
Дана доска размером M × N клеток. Клетка может находиться в одном из двух состояний: 
1 — живая, 0 — мёртвая. Каждая клетка взаимодействует с восемью соседями. Правила таковы:

 1. Живая клетка, у которой меньше двух живых соседей, погибает.

 2. Живая клетка, у которой два или три живых соседа, выживает.

 3. Живая клетка, у которой больше трёх живых соседей, погибает.

 4. Мёртвая клетка, у которой три живых соседа, возрождается.

  Напишите программу, которая будет:
  — случайным образом генерить стартовое состояние;
  — уметь получать его из файла (способ выбирается через параметры запуска в консоли);
  — каждую секунду выводить в консоль новое состояние доски
*/

'use strict';
console.clear();

const fs = require('fs');
const readlineSync = require('readline-sync');

function makeRandomTable(m, n) {
  const table = [];

  for (let i = 0; i < m; i++) {
    const lengthR = n;
    const row = [];

    for (let i = 0; i < lengthR; i++) {
      const randomLive = Math.round(Math.random());
      row.push(randomLive);
    }

    table.push(row);
  }

  return table;
}

function makeTableFromFile() {
  const table = [];

  const data = fs
    .readFileSync('text.txt')
    .toString()
    .split('\n');

  for (let i = 0; i < data.length; i++) {
    const row = data[i].split(' ').map(v => +v);
    table.push(row);
  }

  return table;
}

function showTable(table) {
  console.log('______________');
  table.forEach(v => console.log(v));
}

let way = +readlineSync.question(
  `Введите '1' для генерации случайного состояния таблицы или '2' для получения данных из файла text.txt: `,
);

while (way !== 1 && way !== 2) {
  way = +readlineSync.question(
    'Ой, что-то не так. Пожалуйста, повторите попытку: ',
  );
}

let table;
if (way === 1) {
  table = makeRandomTable(5, 4);
} else {
  table = makeTableFromFile();
}

function liveCyrcle(table) {
  const start = [...table];
  start.forEach((r, i) => (start[i] = [...r]));

  const res = [...table];
  res.forEach((r, i) => (res[i] = [...r]));

  for (let r = 0; r < start.length; r++) {
    for (let c = 0; c < start[r].length; c++) {
      const neighbors = [];

      const noValue = undefined;
      neighbors.push(
        start[r][c - 1],
        start[r][c + 1],
        start[r - 1] === noValue ? null : start[r - 1][c],
        start[r + 1] === noValue ? null : start[r + 1][c],
        start[r - 1] === noValue ? null : start[r - 1][c - 1],
        start[r - 1] === noValue ? null : start[r - 1][c + 1],
        start[r + 1] === noValue ? null : start[r + 1][c - 1],
        start[r + 1] === noValue ? null : start[r + 1][c + 1],
      );

      const numerOfLivingNeibors = neighbors.filter(v => v === 1).length;

      if (numerOfLivingNeibors < 2) res[r][c] = 0;
      if (numerOfLivingNeibors > 3) res[r][c] = 0;
      if (start[r][c] === 0 && numerOfLivingNeibors === 3) res[r][c] = 1;
    }
  }
  showTable(res);
  return res;
}

showTable(table);
setInterval(() => {
  table = liveCyrcle(table);
}, 1000);
