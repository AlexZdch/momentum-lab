import playList from './playList.js';

const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting'); 
const nameInput = document.querySelector('.name');
const body = document.querySelector('body');
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

const playListElement = document.querySelector('.play-list');
const btnPlay = document.querySelector('.play');
const btnPlayPrev = document.querySelector('.play-prev');
const btnPlayNext = document.querySelector('.play-next');

const progress = document.querySelector('.control-playline-progress');
const nameTrack = document.querySelector('.name-track');
const timeSound = document.querySelector('.time-sound');
const language = document.querySelector('.language');

const progressVolume = document.querySelector('.control-volume-progress');
const soundBtn = document.querySelector('.sound');

let isPlay = false;
let playNum = 0;
let leng = '';
const audio = new Audio();
audio.src = playList[playNum].src;
nameTrack.textContent = playList[playNum].title;
timeSound.innerHTML = `${playList[playNum].duration} / 00:00`;


let randomNum = getRandomNum(1,20);


function str0l(val,len) {
    let strVal=val.toString();
    while ( strVal.length < len )
        strVal='0'+strVal;
    return strVal;
}

function setLocalStorage() {
    localStorage.setItem('name', nameInput.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('leng', leng);
  }

  function getLocalStorage() {
    if(localStorage.getItem('leng')) {
        leng = localStorage.getItem('leng');
        language.value = leng;
      } else {
          leng = 'ru';
      }
    if(localStorage.getItem('name')) {
      nameInput.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city') && localStorage.getItem('city') !=='') {
        city.value = localStorage.getItem('city');
        getWeather();
      } else {
        if(leng ==='ru'){  
            city.value = 'Минск';
        }else if(leng ==='eng'){
            city.value = 'Minsk';
        }
        getWeather();
        
      }
      setBg();
      getQuotes();
}

  window.addEventListener('beforeunload', setLocalStorage);
  window.addEventListener('load', getLocalStorage);


function getTimeOfDay() {
    const now = new Date();
    const hour = Math.floor(now.getHours() / 6);
    let res = '';
    let hello = '';
    if(leng === 'ru'){
        if(hour === 0){
            hello = 'Доброй ночи';
            res = 'night';
        } else if(hour === 1){
            hello = 'Доброе утро';
            res = 'morning';
        } else if(hour === 2){
            hello = 'Добрый день';
            res = 'afternoon';
        } else if(hour === 3){
            hello = 'Добрый вечер';
            res = 'evening';
        }
    } else if(leng === 'eng') {
        if(hour === 0){
            hello = 'Good night';
            res = 'night';
        } else if(hour === 1){
            hello = 'Good morning';
            res = 'morning';
        } else if(hour === 2){
            hello = 'Good afternoon';
            res = 'afternoon';
        } else if(hour === 3){
            hello = 'Good evening';
            res = 'evening';
        }
    }
    greeting.innerHTML = hello;
    let placeHolder = '';
    if(leng === 'ru') {
        placeHolder = 'Введите имя';
    }else if(leng === 'eng'){
        placeHolder = 'Enter name';
    }
    nameInput.placeholder = placeHolder;

    return res;
}

function getRandomNum(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg(){
    const timeOfDay =  getTimeOfDay();
    
    let bgNum = '';
    if ( randomNum < 10 ){
          bgNum = '0'+ randomNum;
   } else{
       bgNum = randomNum;
   }
    const urlBg = `https://raw.githubusercontent.com/AlexZdch/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;

    const img = new Image();
    img.src =  urlBg;
    img.onload = () => {      
      body.style.backgroundImage = `url(${urlBg})`;
    }; 


    body.style.backgroundImage = urlBg;
}

function getSlideNext(){
    if(randomNum === 20){
        randomNum = 1;
    } else{
        randomNum += 1;
    }

    setBg();
}

function getSlidePrev(){
    if(randomNum === 1){
        randomNum = 20;
    } else{
        randomNum -= 1;
    }
    setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);


async function getWeather() {  
    let messageError = '';
    if(leng === 'ru'){
        messageError = 'Ошибка при вводе города!';
    } else if(leng ==='eng'){
        messageError = 'Error enter city!';
    }
    if(city.value ===''){
        weatherError.textContent = messageError;
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
        return;

    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${leng}&appid=2c68d32102f39e8e1168aaca486eb21f&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 

    if ( data.cod === '404') {
        weatherError.textContent = messageError;
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';

        return;        
    } else {  
        let messWind = '';
        let messHumidity = '';
        if(leng ==='ru'){
            messWind = 'Ск-ть ветра:';
            messHumidity = 'Влажность:';
        }else if(leng ==='eng'){
            messWind = 'Speed wind:';
            messHumidity = 'Humidity:';
        }
        weatherError.textContent = '';
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${messWind} ${Math.round(data.wind.speed)} м/с`;
        humidity.textContent = `${messHumidity} ${Math.round(data.main.humidity)}%`;
    }
  }

  city.addEventListener('change',getWeather);


  async function getQuotes() {  
    const randQuote = getRandomNum(1,24) - 1;
    let quotes = '';
    if(leng ==='ru'){
        quotes = 'data.json';
    } else if(leng ==='eng') {
        quotes = 'data-eng.json';
    }
    const res = await fetch(quotes);
    const data = await res.json(); 
    quote.textContent = data[randQuote].mes;
    author.textContent = data[randQuote].author;

  }

  changeQuote.addEventListener('click', getQuotes);


function showTime() {
    const arrMonths  = ["январь", "февраль", "март",
    "апрель", "май", "июнь",
    "июль", "август","сентябрь",
    "октябрь","ноябрь","декабрь"];

    const arrMonthsEng  = ["January","February","March",
        "April","May","June","July",
        "August","September","October",
        "November","December"];

    const arrDays  = ["воскресенье", "понедельник", "вторник",
    "среда", "четверг", "пятница",
    "суббота"];

    const arrDaysEng  = ["Sunday","Monday","Tuesday",
    "Wednesday","Thursday","Friday","Saturday",
    "Sunday"];

    const now = new Date();
    const seconds = now.getSeconds();
    const mins = now.getMinutes();
    const hour = now.getHours();

    time.innerHTML= `${str0l(hour,2)}:${str0l(mins,2)}:${str0l(seconds,2)}`;

    const numberDay = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const day = now.getDay();
    if(leng ==='ru'){
        date.innerHTML= `${arrDays[day]}, ${arrMonths[month]} ${numberDay} `;
    }
    if(leng ==='eng'){
        date.innerHTML= `${arrDaysEng[day]}, ${arrMonthsEng[month]} ${numberDay} `;
    }

    getTimeOfDay();

    setTimeout(showTime, 1000);

}

  language.addEventListener('change',(e)=>{
    leng = e.target.value;
    getWeather();
    getQuotes();
});

showTime();
//setBg();
// getQuotes();

  function createPlayList (){
    for(let i = 0; i < playList.length; i ++){
        const liEl = document.createElement('li');
        liEl.classList.add('play-item');
        liEl.textContent = playList[i].title;
        playListElement.append(liEl);
    }
}
 createPlayList();

const itemPlayElements = playListElement.querySelectorAll('.play-item');

function addActiveItem() {
    for(let i = 0; i < itemPlayElements.length; i ++ ){
        itemPlayElements[i].classList.remove('item-active');
    }
    itemPlayElements[playNum].classList.add('item-active');
  }


function playAudio(){

    if(!isPlay){
        nameTrack.textContent = playList[playNum].title;
        audio.play();
        isPlay = true;
        toggleBtn();
        addActiveItem();

    } else if(isPlay){
        audio.pause();
        isPlay = false;
        toggleBtn();
    }
}

function toggleBtn() {
    btnPlay.classList.toggle('pause');
  }

function toPlayNext(){
    if(playNum == playList.length-1){
        playNum = 0;
 
    } else{
        playNum += 1;
    }

    if(!isPlay){
        audio.src = playList[playNum].src;
        playAudio();
    }else {
        audio.src = playList[playNum].src;
        nameTrack.textContent = playList[playNum].title; 
        audio.play();
        addActiveItem();
    }
}

function toPlayPrev(){
    if(playNum == 0){
        playNum = playList.length-1;
 
    } else{
        playNum -= 1;
    }

    if(!isPlay){
        audio.src = playList[playNum].src;
        playAudio();
    }else {
        audio.src = playList[playNum].src;
        nameTrack.textContent = playList[playNum].title; 
        audio.play();
        addActiveItem();
    }
}

function getCurrentProgress() {
    progress.value = (audio.currentTime / audio.duration) * 100;
}

function setCurrentProgress(){
    audio.currentTime = (progress.value * audio.duration) / 100;   
}

function setTimeAudio(){
    let minutes = Math.floor(audio.currentTime / 60);
    if(minutes < 10){
        minutes = '0' + minutes;
    }

    let seconds = Math.floor(audio.currentTime % 60);
    if(seconds < 10){
        seconds = '0' + seconds;
    }
    timeSound.innerHTML = `${playList[playNum].duration} / ${minutes}:${seconds}`;
}


function setSoundState(){
    if(audio.muted){
        audio.muted = 0;
        audio.volume = 0.5;
        progressVolume.value = 50;
        soundBtn.classList.toggle('mute');

    } else {
        audio.muted = 1;
        audio.volume = 0;
        progressVolume.value = 0;
        soundBtn.classList.toggle('mute');
    }
    
}

function getCurrentProgressVolume(){
    progressVolume.value = audio.volume * 100;   
}

function setCurrentProgressVolume(){
    audio.volume = progressVolume.value / 100;   
    if (progressVolume.value == 0){
        audio.muted = 1;    
        soundBtn.classList.toggle('mute');
    } else {
        audio.muted = 0;   
        if(soundBtn.classList.contains('mute')) {
            soundBtn.classList.remove('mute');
        }
    }
}

progressVolume.addEventListener('input', setCurrentProgressVolume);
soundBtn.addEventListener('click', setSoundState);


getCurrentProgress();
getCurrentProgressVolume();

  btnPlayPrev.addEventListener('click',toPlayPrev);
  btnPlayNext.addEventListener('click',toPlayNext);

  btnPlay.addEventListener('click',playAudio);

  audio.addEventListener('loadeddata', getCurrentProgress);
  audio.addEventListener('timeupdate', getCurrentProgress);
  audio.addEventListener('timeupdate', setTimeAudio);
  audio.addEventListener('ended', toPlayNext);
  progress.addEventListener('input', setCurrentProgress);
  

const strReport = `Часы и календарь +15 \n
время выводится в 24-часовом формате, например: 21:01:00 +5 \n
время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) +5 \n
выводится день недели, число, месяц +5 \n
Приветствие +10 \n
текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь) +5 \n
пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется, данные о нём хранятся в local storage +5 \n
Смена фонового изображения +20 \n
ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20) +5 \n
изображения перелистываются последовательно  +5 \n
изображения перелистываются по кругу +5 \n
при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения +5 \n
Виджет погоды +15 \n
при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage +5 \n
данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел +5\n
выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) +5\n
Виджет цитата дня +10\n
при загрузке страницы приложения отображается рандомная цитата и её автор +5\n
при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) +5\n
Аудиоплеер +15\n
при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause +3\n
при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play +3\n
треки можно пролистывать кнопками Play-next и Play-prev\n
треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) +3\n
трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем +3\n
после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. +3\n
Продвинутый аудиоплеер (реализуется без использования библиотек) +17\n
добавлен прогресс-бар в котором отображается прогресс проигрывания +3\n
при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека +3\n
над прогресс-баром отображается название трека +3\n
отображается текущее и общее время воспроизведения трека +3\n
есть кнопка звука при клике по которой можно включить/отключить звук +2\n
добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука +3\n
можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте +0\n
Перевод приложения на два языка (en/ru или en/be) +12\n
переводится язык и меняется формат отображения даты +3\n
переводится приветствие и placeholder +3\n
переводится прогноз погоды в т.ч описание погоды (OpenWeatherMap API предоставляет такую возможность) и город по умолчанию +3 (можно проверить, если ввести пустую строку и перезагрузить страницу)\n
переводится цитата дня (используйте подходящий для этой цели API, возвращающий цитаты на нужном языке или создайте с этой целью JSON-файл с цитатами на двух языках) +3\n
Получение фонового изображения от API +0\n
Настройки приложения +0\n
Дополнительный функционал на выбор +0\n
Суммарный балл: 114.`;
  console.log(strReport);