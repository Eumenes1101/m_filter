// ==UserScript==
// @name        m_filter
// @namespace   m_filter
// @description Фильтр анкет для сайта don-m.ru
// @include     http://don-m.ru/*
// @version     1.03
// @grant       none
// @author      Eumenes
// @license     GNU GPL v3
// ==/UserScript==

// Загружаем состояние из localStorage
var blacklist = [];
blacklist = localStorage.blacklist ? JSON.parse(localStorage.blacklist) : [];
var FBlack;
FBlack = localStorage.FBlack ? JSON.parse(localStorage.FBlack) : false;
var FSideBar;
FSideBar = localStorage.FSideBar ? JSON.parse(localStorage.FSideBar) : false;

// #region BlackList
// ##############################

// функция для очистки BlackList
function clearBlackList(){
	blacklist = [];
	localStorage.blacklist = JSON.stringify(blacklist);
	window.location.reload();
}

// функция для сохранения BlackList
function showBlackList(){
	prompt("BlackList", JSON.stringify(blacklist));
}

// функция для внесения анкет в BlackList
function enterBlackList(){
	var new_JSON_black_list = prompt("Enter BlackList");
	var new_removelist = [];
	try {
		new_removelist = JSON.parse(new_JSON_black_list);
		for (var i = 0; i < new_removelist.length; i++) {
			if (blacklist.indexOf(new_removelist[i]) == -1) {
				blacklist[blacklist.length] = new_removelist[i];
			}
		}
		localStorage.blacklist = JSON.stringify(blacklist);
		window.location.reload();
	}
	catch (e) {
		
	}
}

// переключение между режимами White/Black List
function inverseFBlack(){
	FBlack = !FBlack;
	localStorage.FBlack = JSON.stringify(FBlack);
	window.location.reload();
}

// функция для работы с BlackList
function removethis(el){
	var girlid = this.parentNode.getAttribute('data-girlid');
	if (FBlack == false) {
		blacklist[blacklist.length] = girlid;
	} else {
		var idx = blacklist.indexOf(girlid);
		if (idx != -1) {
			blacklist.splice(idx, 1);
		}
	}
	localStorage.blacklist = JSON.stringify(blacklist);
	this.parentNode.remove();
}
// ##############################
// #endregion


// #region btn
// ##############################

// скрыть/показать боковую панель
function displaybar()
{
	var myprofile = document.querySelector('.myprofile');
	if (myprofile.style.display == "block") {
		myprofile.style.display = "none";
	} else { 
		myprofile.style.display = "block";
	}
	FSideBar = !FSideBar;
	localStorage.FSideBar = JSON.stringify(FSideBar);
}

document.querySelector('body').insertAdjacentHTML('beforeend', '<style>.remthis{background-color:#008bec;color:#fff;cursor:pointer;font-size:10px;padding:1px 5px;z-index:100;}.remthis{margin-top:0px;}.remthis:hover{background-color:#cb4437}</style>');
document.querySelector('body').insertAdjacentHTML('beforeend', '<style>.mbtn{background-color:#008bec;color:#fff;cursor:pointer;font-size:10px;padding:3px 5px;z-index:100;}.mbtn{margin:0px;top:0px;position:absolute;}.mbtn:hover{background-color:#cb4437}</style>');
document.querySelector('body').insertAdjacentHTML('beforeend', '<style>.myprofile {width: 1px;height: 1px;background: #eee;display: none;position:fixed;left:0;top:115px;z-index:9999;}mybar {display: block;padding: 4px 8px;background: #666;color: #fff;position:fixed;left:0;top:115px;text-align: center;z-index:99999;}</style>');
document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="myprofile"></div><mybar>></mybar>');
// Добавляем сбоку выдвижную панель с кнопками
var title = document.querySelector('mybar');
title.onclick = displaybar;
var myprof = document.querySelector('.myprofile');
var btnCSS = 'margin:5px 32px; text-align:  center; width: 160px; font-size:14px;';
var btnText = ["black/white list", "clear blacklist", "save blacklist", "load blacklist"];
var btnFunc = {
	Functions: [inverseFBlack, clearBlackList, showBlackList, enterBlackList]  
}
for (var i = 0; i < btnText.length; i++) {
	var btn = document.createElement("BUTTON");
	var t = document.createTextNode(btnText[i]);
	btn.appendChild(t);
	btn.style.cssText = btnCSS;
	btn.onclick = btnFunc.Functions[i];
	myprof.appendChild(btn);
}
if (FSideBar == true) {
	myprof.style.display = "block";
}
// ##############################
// #endregion


// #region main
// ##############################

// Пробегаем по всем анкетам
var titlelist = document.querySelectorAll('.list-girls-item');
[].forEach.call(titlelist, function(el) {
	var girlid = el.getAttribute('data-girlid');
	// Если анкета находится в BlackList, то удаляем её
	// Иначе добавляем в правый верхний угол кнопку 'Удалить'
	// В режиме просмотра BlackList добавляем кнопку 'Исключить из BlackList'
	if ( (blacklist.indexOf(girlid) !== -1) ? !FBlack : FBlack) {
		el.remove();
	} else {
		var remthis = document.createElement('div');
		if (FBlack == false) {
			remthis.textContent = 'Удалить';
		} else {
			remthis.textContent = 'Исключить из BlackList';
		}
		remthis.onclick = removethis;
		remthis.className = "remthis";
		el.insertBefore(remthis, el.children[0]);
	}
});
// ##############################
// #endregion
