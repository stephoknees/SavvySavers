chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

displayPurchase();

function displayPurchase(one = false) {
  chrome.storage.local.get({items:[]}, function(result) {
    // gets list of pairs
    let items = result.items;

    var purchaseContainer = document.getElementById("purchaseContainer");
    
    console.log(items);
    var i;
    for ((one) ?  i = items.length - 1 : i = 0;i < items.length; i++) {
      for (kv in items[i]) {
        console.log("index check: " + i);
        
        var buttonContainer = document.createElement("div");
        
        var purchaseEntry = document.createElement("p");
        purchaseEntry.innerHTML = `${kv}: ${items[i][kv]}`;
        
        var purchaseDelete = document.createElement("button");
        purchaseDelete.innerHTML = "x";

        buttonContainer.classList.add("buttonContainer");
        buttonContainer.id = i;
  
        purchaseDelete.addEventListener("click", function() {
          deleteEntry(this);
        });
        purchaseDelete.classList.add("delete");
        buttonContainer.appendChild(purchaseDelete);
        
        purchaseEntry.classList.add("entry");
        buttonContainer.appendChild(purchaseEntry);
        
        purchaseContainer.appendChild(buttonContainer);
      }
    }
})};

  
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

        displayPurchase(true);
      });
    });
  });
}

function deleteEntry(entry) {
  chrome.storage.local.get({items:[]}, function(result) {
    console.log(entry.parentNode.id);
    
    items = result.items;
    let remove = entry.parentNode.id;

    items.splice(remove, 1);
    chrome.storage.local.set({items: items});

    entry.parentNode.remove();

    if (remove != items.length) {
      reset(remove);
    }
  });
}

function reset(removeIndex) {
  var buttonContainers = document.getElementsByClassName("buttonContainer");

  chrome.storage.local.get({items:[]}, function(result) {
    for (var i = removeIndex; i < items.length; i++) {
      buttonContainers[i].id = i;
    }
  });
}

var addButton = document.getElementById("add");
addButton.addEventListener("click", scrapePage);