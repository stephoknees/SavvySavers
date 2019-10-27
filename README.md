# HOW TO USE
1. Clone the repo into a folder
2. Go to [chrome extensions](chrome://extensions)
3. Click on **Load Unpacked** and select the folder containing the repo (should include the *manifest.json*)
4. Turn on Developer Mode
5. Access any final checkout screen, open the extension, and add the purchase!

# DEVELOPMENT
* *manifest.json* is the blueprint for the app which calls the other functions and sets permissions
* *popup.html* is the main page for the extension and holds all the elements
* *popup.html* uses *popup.js* for button click actions and any other scripting uses
* *getPagesSource.js* is injected into the active tab to return the html of the current page