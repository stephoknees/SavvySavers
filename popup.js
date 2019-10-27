chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});
  
function scrapePage() {
  chrome.storage.local.get({items:[]}, function(result) {
    // gets list of pairs
    let items = result.items;
    
    chrome.tabs.getSelected(null, function(tab) {
      let domain = tab.url;

      let begin = domain.indexOf("www.") + 4;
      let begin2 = domain.indexOf("https://") + 8;
      begin = (begin2 > begin) ? begin2 : begin;
      let end = domain.indexOf(".com");
      domain = domain.substring(begin,end);

      var message = document.querySelector('#message');
      
      chrome.tabs.executeScript(null, {
          file: "getPagesSource.js"
      }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
        
        let text = message.innerText.toLowerCase();
        let prepos = text.lastIndexOf("tax");
        if(prepos < 0) return;
        
        prepos = text.lastIndexOf("total", prepos);
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
        // chrome.storage.local.clear();

        displayPurchase(items[0]);
      });
    });
  });
}
  
function displayPurchase(purchases) {
  var purchaseContainer = document.getElementById("purchaseContainer");
  var buttonContainer = document.createElement("div");
  var purchaseEntry = document.createElement("p");
  var purchaseDelete = document.createElement("button");
  purchaseDelete.innerHTML = "x";

  for (data in purchases) {
    purchaseEntry.innerHTML = `${data}: ${purchases[data]}`;

    buttonContainer.classList.add("buttonContainer");

    purchaseDelete.addEventListener("click", function() {
      deleteEntry(purchaseDelete);
    });
    purchaseDelete.classList.add("delete");
    buttonContainer.appendChild(purchaseDelete);
    
    purchaseEntry.classList.add("entry");
    buttonContainer.appendChild(purchaseEntry);
    
    purchaseContainer.appendChild(buttonContainer);
  }
}

function deleteEntry(entry) {
  console.log(entry.parentNode);
  entry.parentNode.remove();
}

var addButton = document.getElementById("add");
addButton.addEventListener("click", scrapePage);