// ==UserScript==
// @name        m_filter
// @namespace   m_filter
// @description Фильтр анкет для сайта don-m.ru
// @include     http://don-m.ru/*
// @version     1.01
// @grant       none
// @author      Eumenes
// @license     GNU GPL v3
// ==/UserScript==

// Загружаем состояние из localStorage
var blacklist = [];
blacklist = localStorage.blacklist ? JSON.parse(localStorage.blacklist) : [];

// #region BlackList
// ##############################

// функция для очистки BlackList
function clearBlackList(){
	blacklist = [];
	localStorage.blacklist = JSON.stringify(blacklist);
	window.location.reload();
}

// функция для работы с BlackList
function removethis(el){
	var girlid = this.parentNode.getAttribute('data-girlid');
	blacklist[blacklist.length] = girlid;
	localStorage.blacklist = JSON.stringify(blacklist);
	this.parentNode.remove();
}
// ##############################
// #endregion


// #region main
// ##############################

// Добавляем сверху страницы кнопку 'Clear BlackList'
var title = document.querySelector('.header-logo');
var delall = document.createElement('span');
delall.textContent = 'Clear BlackList';
delall.className = 'remthis';
delall.onclick = clearBlackList;
title.appendChild(delall);

document.querySelector('body').insertAdjacentHTML('beforeend', '<style>.remthis{background-color:#008bec;color:#fff;cursor:pointer;font-size:10px;padding:1px 5px;z-index:100;}.remthis{margin-top:0px;}.remthis:hover{background-color:#cb4437}</style>');
// Пробегаем по всем анкетам
var titlelist = document.querySelectorAll('.list-girls-item');
[].forEach.call(titlelist, function(el) {
	var girlid = el.getAttribute('data-girlid');
	// Если анкета находится в BlackList, то удаляем её
	// Иначе добавляем в правый верхний угол кнопку 'Удалить'
	if ( blacklist.indexOf(girlid) !== -1 ) {
		el.remove();
	} else {
		var remthis = document.createElement('div');
		remthis.textContent = 'Удалить';
		remthis.onclick = removethis;
		remthis.className = "remthis";
		el.insertBefore(remthis, el.children[0]);
	}
});
// ##############################
// #endregion
