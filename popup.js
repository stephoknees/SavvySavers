chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      message.innerText = request.source;
    }
  });
  
function scrapePage() {
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
        prepos = text.indexOf("total", prepos);
        let pos = text.indexOf("$", prepos);
        pos += 1;
        let amount = '';
        while(text.charAt(pos) != '<') {
            amount += text.charAt(pos++);
        }
        message.innerText = amount;
    });

}
  
  window.onload = scrapePage;