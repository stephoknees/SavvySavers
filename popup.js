chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      message.innerText = request.source;
    }
  });
  
function scrapePage() {
  chrome.storage.local.get({items:[]}, function(result) {
    // gets list of pairs
    let items = result.items;
    console.log(items);
    chrome.tabs.getSelected(null, function(tab) {
      let domain = tab.url;
      let begin = domain.indexOf("www.") + 4;
      let begin2 = domain.indexOf("https://") + 8;
      begin = (begin2 > begin) ? begin2 : begin;
      let end = domain.indexOf(".com");
      domain = domain.substring(begin,end);
      let message = document.querySelector('#message');
      chrome.tabs.executeScript(null, {
          file: "getPagesSource.js"
      }, function() {
          // If you try and inject into an extensions page or the webstore/NTP get an error
          if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
          }
          let text = message.innerText.toLowerCase();
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
          item[domain] = amount.trim();
          items.push(item);
          chrome.storage.local.set({items: items});
          //alert(items);
          console.log(items);
          //chrome.storage.local.clear();
      });
    });
  });
}
// links button click
let purchase = document.getElementsByClassName("purchase_button");
purchase[0].onclick = scrapePage;