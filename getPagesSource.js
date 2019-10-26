
function DOMtoString(document_root) {
    let html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                html += node.outerHTML;
                break;
            case Node.TEXT_NODE:
                html += node.nodeValue;
                break;
            case Node.CDATA_SECTION_NODE:
                html += '<![CDATA[' + node.nodeValue + ']]>';
                break;
            case Node.COMMENT_NODE:
                html += '<!--' + node.nodeValue + '-->';
                break;
            case Node.DOCUMENT_TYPE_NODE:
                // (X)HTML documents are identified by public identifiers
                html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
                break;
        }
        node = node.nextSibling;
    }
    console.log(html);
    return html;
}

function parseTotal(document_root) {
    let text = DOMtoString(document_root).toLowerCase();
    let prepos = text.lastIndexOf("tax");
    prepos = text.indexOf("total", prepos);
    let pos = text.indexOf("$", prepos);
    pos += 1;
    let amount = '';
    while(text.charAt(pos) != '<') {
        amount += text.charAt(pos++);
    }
    return amount;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: parseTotal(document)
});