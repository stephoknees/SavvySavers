chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      message.innerText = request.source;
    }
  });
  
let scrapePage = 
  chrome.storage.local.get({items:[]}, function(result) {
    // gets list of pairs
    let items = result.items;
    chrome.tabs.getSelected(null, function(tab) {
      let domain = tab.url;
      var message = document.querySelector('#message');
      chrome.tabs.executeScript(null, {
          file: "getPagesSource.js"
      }, function() {
          // If you try and inject into an extensions page or the webstore/NTP you'll get an error
          if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
          }
          let text = message.innerText;
          let prepos = text.lastIndexOf("tax");
          if(prepos < 0) return;
          prepos = text.indexOf("total", prepos);
          if(prepos < 0) return;
          let pos = text.indexOf("$", prepos);
          if(pos < 0) return;
          pos += 1;
          let amount = '';
          while(text.charAt(pos) != '<') {
              amount += text.charAt(pos++);
          }
          let item = {}
          item[domain] = amount;
          items.push(item);
          chrome.storage.local.set({items: items});
          alert(items);
          // chrome.storage.local.clear();
      });
    });
  });
  
window.onload = scrapePage;
let purchase = document.getElementsByClassName("purchase_button");
// purchase[0].onclick = scrapePage;
purchase[0].addEventListener("click", scrapePage);
console.log(purchase);