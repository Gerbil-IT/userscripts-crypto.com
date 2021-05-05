// ==UserScript==
// @name         Crypto.com trade enrich v2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://crypto.com/*
// @icon         https://www.google.com/s2/favicons?domain=crypto.com
// @grant        none
// ==/UserScript==

//We need this because the match is on generic domain
//If @match is on full url, the script will load only on refresh not on accessing via link
//and not when comming from the ajax links
var pageURLCheckTimer = setInterval (
    function () {
        if ( this.lastPathStr !== location.pathname
            || this.lastQueryStr !== location.search
            || this.lastPathStr === null
            || this.lastQueryStr === null
        ) {
            this.lastPathStr = location.pathname;
            this.lastQueryStr = location.search;
            gmMain ();
        }
    }
    , 222
);

function gmMain () {
    var isCorrectURL;
    if (window.self === window.top){
        isCorrectURL = document.URL.includes('https://crypto.com/exchange/trade/spot/');
        if(isCorrectURL){
            runMain();
        }
    }
}



function runMain(){

    //don't execute twice (because of the iframe)
    if (!window.frameElement) {
        //Wait for the table to load
        setTimeout(onClickAction, 5000);
        setTimeout(headers, 5000);
        setTimeout(rowsEnhancer, 5000);
        //setTimeout(showActive, 5000);
       // setTimeout(showHistory, 5000);
        //setTimeout(sorts, 5000);
    }
}






function rowsEnhancer(){
    var rows = document.querySelectorAll('div.order-list-box.order-list div.e-tabs.tabs div.e-tabs__panes div.e-tab-pane div.order-table.e-table div.e-tabler-inner div.e-table__body-wrapper.auto-scroll table.e-table__body tbody tr.e-table-row');
    for (var e = 0; e < rows.length ; e++){
        var td = rows[e].querySelectorAll('td div.cell');

        var price = rows[e].querySelectorAll('td div.cell')[4].innerHTML;
        var volume = rows[e].querySelectorAll('td div.cell')[5].innerHTML;

        var usdtAlreadyShown = rows[e].querySelectorAll('td.usdt');

        if(usdtAlreadyShown.length == 0){
            var newel = document.createElement('td');
            var elementid = document.getElementsByTagName("td").length
            newel.setAttribute('class','usdt');
            newel.innerHTML = "$" + parseFloat(price * volume).toFixed(2);
            rows[e].appendChild(newel);
        }
        else {
            for(var k = 0; k < usdtAlreadyShown.length; k++) {
                usdtAlreadyShown[k].innerHTML = "$" + parseFloat(price * volume).toFixed(2);
            }
        }
    }
}

function headers(){
    // when sorting, we need to do the refresh on the USDT column as well
    var headerRows = document.querySelectorAll('table.e-table__header thead tr');

    var newel = document.createElement('th');
    newel.setAttribute('id', 'USDT');
    newel.setAttribute('class', 'usdtHeader');
    newel.innerHTML = "USDT";


    for(var s=0; s < headerRows.length; s++){
        var usdtOrdersAlreadyShown = headerRows[s].querySelectorAll('th.usdtHeader'+s);
        if(usdtOrdersAlreadyShown[0] == null){
            newel.setAttribute('class', 'usdtHeader'+s);
            headerRows[s].appendChild(newel);
        }
    }
    
}


function onClickAction(){
    var tabs = document.querySelectorAll('div.e-tabs__nav-item');
    for(var i = 0; i < tabs.length; i++) {
        if(tabs[i].innerHTML.includes("Order History")){
            //tabs[i].onclick = rowsEnhancer;
            tabs[i].onclick = runMain;
        }
    }
}













function showActive(){

    var firstTd = document.querySelectorAll('div.order-list-box.order-list div.e-tabs.tabs div.e-tabs__panes div.e-tab-pane div.order-table.e-table div.e-tabler-inner div.e-table__body-wrapper.auto-scroll table.e-table__body tbody tr.e-table-row td');
    if(firstTd.length == 0){
        var split = firstTd[0].className.split('_');
        split[0] = split[0].split('-')[2];

        var price = document.querySelectorAll('tr.e-table-row td.e-table-'+split[0]+'_column_'+(4+parseInt(split[2]))+' div.cell');
        var volume = document.querySelectorAll('tr.e-table-row td.e-table-'+split[0]+'_column_'+(5+parseInt(split[2]))+' div.cell');

        var rows = document.querySelectorAll('div.order-list-box.order-list div.e-tabs.tabs div.e-tabs__panes div.e-tab-pane div.order-table.e-table div.e-tabler-inner div.e-table__body-wrapper.auto-scroll table.e-table__body tbody tr.e-table-row');

        var usdtAlreadyShown = document.querySelectorAll('td.usdt');
        if(usdtAlreadyShown[0] == null){
            for(var j = 0; j < price.length; j++) {
                var newel = document.createElement('td');
                var elementid = document.getElementsByTagName("td").length
                newel.setAttribute('id','usdt');
                newel.setAttribute('class','usdt');
                newel.innerHTML = "$" + parseFloat(price[j].innerHTML * volume[j].innerHTML).toFixed(2);
                rows[j].appendChild(newel);
            }
        }
        else {
            for(var k = 0; k < usdtAlreadyShown.length; k++) {
                usdtAlreadyShown[k].innerHTML = "$" + parseFloat(price[k].innerHTML * volume[k].innerHTML).toFixed(2);
            }
        }
    }
}



function showHistory(){
    setTimeout(() => {

        sorts();
        showActive();


        var td = document.querySelectorAll('div.order-list-box.order-list div.e-tabs.tabs div.e-tabs__panes div.e-tab-pane div.order-table.e-table div.e-tabler-inner div.e-table__body-wrapper.auto-scroll table.e-table__body tbody tr.e-table-row td');
        var tdCell = document.querySelectorAll('div.order-list-box.order-list div.e-tabs.tabs div.e-tabs__panes div.e-tab-pane div.order-table.e-table div.e-tabler-inner div.e-table__body-wrapper.auto-scroll table.e-table__body tbody tr.e-table-row td div');

        var split = td[0].className.split('_');
        split[0] = split[0].split('-')[2];

        var historyLoaded = 0;
        for(var v = 0; v < td.length; v++){
            var splitTd = td[v].className.split('_');
            splitTd[0] = splitTd[0].split('-')[2];
            if(splitTd[0] != undefined && splitTd[0] != split[0]){
                historyLoaded= v%10;
                split[0]=splitTd[0];
                split[2]=splitTd[2]
                break;
            }
        }

        var price = document.querySelectorAll('tr.e-table-row td.e-table-'+split[0]+'_column_'+(5+parseInt(split[2]))+' div.cell');
        var volume = document.querySelectorAll('tr.e-table-row td.e-table-'+split[0]+'_column_'+(6+parseInt(split[2]))+' div.cell');

        var rowsOrders = document.querySelectorAll('div.order-list-box.order-list div.e-tabs.tabs div.e-tabs__panes div.e-tab-pane div.order-table.e-table div.e-tabler-inner div.e-table__body-wrapper.auto-scroll table.e-table__body tbody tr.e-table-row');

        var usdtOrdersAlreadyShown = document.querySelectorAll('td.usdtorders');
        if(usdtOrdersAlreadyShown[0] == null){
            for(var l = historyLoaded; l < price.length; l++) {
                var newel = document.createElement('td');
                var elementid = document.getElementsByTagName("td").length
                newel.setAttribute('id','usdtorders');
                newel.setAttribute('class','usdtorders');
                newel.innerHTML = "$" + parseFloat(price[l-historyLoaded].innerHTML * volume[l-historyLoaded].innerHTML).toFixed(2);
                rowsOrders[parseInt(l)].appendChild(newel);
            }
        }
        else {
            for(var m = historyLoaded; m < usdtOrdersAlreadyShown.length; m++) {
                usdtOrdersAlreadyShown[m].innerHTML = "$" + parseFloat(price[m-historyLoaded].innerHTML * volume[m-historyLoaded].innerHTML).toFixed(2);
            }
        }

      }, 2000);
}



