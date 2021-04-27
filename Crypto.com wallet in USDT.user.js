// ==UserScript==
// @name         Crypto.com wallet in USDT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  show the ballances in USDT
// @author       Virgil Marin
// @match        https://crypto.com/*
// @icon         https://www.google.com/s2/favicons?domain=crypto.com
// @grant        none
// ==/UserScript==

//don't execute twice (because of the iframe)
if (!window.frameElement) {
    //Wait for the table to load
    setTimeout(show, 3000);
    setTimeout(sorts, 3000);
}

function show(){

    var btc = document.querySelectorAll('div.estimate-values div.estimate-symbol');
    var usd = document.querySelectorAll('div.estimate-usd');
    var btcValue = btc[0].innerHTML.split(" ")[0];
    var usdValue = usd[0].innerHTML.split(" ")[0];
    usdValue = usdValue.split("$")[1];
    var btcUsd = usdValue / btcValue;

    var btcValues = document.querySelectorAll('tr.e-table-row td.e-table-1_column_5 div.cell');
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



