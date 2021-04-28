// ==UserScript==
// @name         Crypto.com wallet in USDT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show the ballances in USDT
// @author       Virgil Marin
// @match        https://crypto.com/*
// @icon         https://www.google.com/s2/favicons?domain=crypto.com
// ==/UserScript==

//We need this because the match is on generic domain
//If @match is on full url, the script will load only on refresh not on accessing via link
//and not when comming from the ajax links
var pageURLCheckTimer = setInterval (
    function () {
        if (    this.lastPathStr  !== location.pathname
            ||  this.lastQueryStr !== location.search
            ||  this.lastPathStr   === null
            ||  this.lastQueryStr  === null
        ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            gmMain ();
        }
    }
    , 222
);

function gmMain () {
    var isCorrectURL;
    if (window.self === window.top){

        isCorrectURL = document.URL.includes('https://crypto.com/exchange/wallets/spot/balances');
        if(isCorrectURL){
            runMain();
        }
    }
}



function runMain(){
    //don't execute twice (because of the iframe)
    if (!window.frameElement) {
        //Wait for the table to load
        setTimeout(show, 3000);
        setTimeout(sorts, 3000);
    }
}

function show(){
    var btc = document.querySelectorAll('div.estimate-values div.estimate-symbol');
    var usd = document.querySelectorAll('div.estimate-usd');
    var btcValue = btc[0].innerHTML.split(" ")[0];
    var usdValue = usd[0].innerHTML.split(" ")[0];
    usdValue = usdValue.split("$")[1];
    var btcUsd = usdValue / btcValue;


    var firstTd = document.querySelectorAll('tr.e-table-row td');

    var split = firstTd[0].className.split('_');
    split[0] = split[0].split('-')[2];

    var btcValues = document.querySelectorAll('tr.e-table-row td.e-table-'+split[0]+'_column_'+(4+parseInt(split[2]))+' div.cell');

    var rows = document.querySelectorAll('tr.e-table-row');

    var usdtAlreadyShown = document.querySelectorAll('td.usdt');
    if(usdtAlreadyShown[0] == null){
        for(var j = 0; j < btcValues.length; j++) {
            var newel = document.createElement('td');
            var elementid = document.getElementsByTagName("td").length
            newel.setAttribute('id','usdt');
            newel.setAttribute('class','usdt');
            newel.innerHTML = "$" + parseFloat(btcValues[j].innerHTML * btcUsd).toFixed(2);
            rows[j].appendChild(newel);
        }
    }
    else {
        for(var k = 0; k < usdtAlreadyShown.length; k++) {
            usdtAlreadyShown[k].innerHTML = "$" + parseFloat(btcValues[k].innerHTML * btcUsd).toFixed(2);
        }
    }
}


function sorts(){
    // when sorting, we need to do the refresh on the USDT column as well
    var headerRows = document.querySelectorAll('table.e-table__header thead tr');

    var newel = document.createElement('td');
    newel.setAttribute('id', 'USDT');
    newel.innerHTML = "USDT";
    headerRows[0] .appendChild(newel);

    var btcHeader = document.querySelectorAll('table.e-table__header thead tr th div.cell span.sortable');
    for(var i = 0; i < btcHeader.length; i++) {
        btcHeader[i].onclick = show;
    }
}



