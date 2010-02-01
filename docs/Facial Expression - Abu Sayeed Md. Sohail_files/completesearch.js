
/*
document.write(
    '<input type="text" size="40" style="float:right;color:#888;" ' +
    'onclick="this.blur(); window.location.href=\'' + completeSearchLink + '\'" ' +
    'value="click here for facets and more..."/>'
);
*/

window.onload = init;

function init()
{
  time_E = new Date().getTime();
  getFacetBoxes();
}

// nice hack from http://javascript.internet.com/snippets/convert-html-entities.html 
function html_entity_decode(str) 
{
  var ta = document.createElement("textarea");
  ta.innerHTML = str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
  return ta.value;
}

function getQueryFromUrl()
{
  var url = window.location.href;
  author = url.match(/([^\/]+)\.html$/)[1];
  // e.g., K=ouml=nig:Felix_G= -> K&ouml;nig:Felix_G=
  author = author.replace(/=([a-zA-Z]+?)=/g, "&$1;");
  // e.g., K&ouml;nig:Felix_G= -> K�nig:Felix_G=
  author = html_entity_decode(author);
  // e.g., K�nig:Felix_G= -> k�nig:felixg
  author = author.replace(/[_=]/g, "").toLowerCase();
  // e.g., K�nig:FelixG -> author:felixgk�nig
  var parts = author.match(/^(.*?):(.*)$/);
  return "author:" + parts[2] + parts[1] + ":";
}

function showFacetBoxes(boxes) 
{
    time_D = new Date().getTime() - time_D;

    var tables = document.getElementsByTagName("table");
    if (!tables.length) return;
    var table = tables[0];
    table.style.overflow = "hidden";
    var sidebar = document.createElement("div");
    sidebar.id = "sidebar";
    sidebar.style.cssFloat = "right";
    sidebar.style.styleFloat = "right";
    sidebar.style.width = "300px";
    sidebar.style.marginLeft = "20px";
    sidebar.innerHTML = boxes;
    table.parentNode.insertBefore(sidebar, table);

    var link = document.createElement("a");
    link.style.cssFloat = "right";
    link.style.styleFloat = "right";
    // Have a space after the query (so that user can just continue typing)
    // TEMPRORAILY NO SPACE (more/less does not work, Markus is working on it - 06Mar08)
    link.href = "http://dblp.mpi-inf.mpg.de/dblp-mirror/index.php#query=" + authorQuery;
      //link.href = "http://dblp.mpi-inf.mpg.de/dblp-mirror/relay.php?query=" + authorQuery + "&fh=1";
      //link.href = "http://dblp.mpi-inf.mpg.de/dblp-mirror/reset.php?session_name=dblpmirror&index_url=/index.php";
    link.innerHTML = "Facets and more with CompleteSearch"; 
    // insert before text node "List of publications ..."
    var h1s = document.getElementsByTagName("h1");
    if (h1s.length < 1) return;
    var element = h1s[0];
    while (!element.data || !element.data.match(/List of/)) element = element.nextSibling;
    element.parentNode.insertBefore(link, element);

    var hrs = document.getElementsByTagName("hr");
    if (hrs.length < 2) return;
    //var hr = hrs[0];
    //hr.parentNode.insertBefore(link, hr.nextSibling);
    hr = hrs[0];
    form = document.createElement("form");
    form.action = "http://dblp.mpi-inf.mpg.de/dblp-mirror/relay.php";
      //form.action = "http://dblp.mpi-inf.mpg.de/dblp-mirror/relay.php?fh=1";
    form.method = "GET";
    form.style.cssFloat   = "right";
    form.style.styleFloat = "right";
    form.style.width      = "300px";
    if   (navigator.appName == "Microsoft Internet Explorer") form.style.margin     = "-3px 0";
    else                                                      form.style.margin     = "0";
    form.style.padding    = "0";
    input = document.createElement("input");
    input.name = "query"
    input.value = authorQuery; // + " "; //"";  //authorQuery;
    input.style.width   = "300px";
    input.style.margin  = "0";
    input.style.padding = "0";
      //input.autocomplete = "off";
    //input.disabled = true;
    form.appendChild(input);
      //Button = document.createElement("input");
      //Button.type = "submit";
      //Button.value = "Search";
      //Button.style.width = "70px";
      //Button.style.border = "1";
      //Form.appendChild(button);
    hr.parentNode.insertBefore(form, hr.nextSibling);
    input.focus();
    hr = hrs[1];
    if (navigator.appName == "Microsoft Internet Explorer") hr.style.clear = "both";
    if (input.createTextRange)
    {
      var v = input.value;
      var r = input.createTextRange();
      r.moveStart('character', v.length);
      r.select();
    }

    // hack to fix padding left of hit numbers, as in "Kurt Mehlhorn (274)"
    var hit_numbers = document.getElementsByTagName("span");
    for (var i = 0; i < hit_numbers.length; ++i) 
      if (hit_numbers[i].className == "hits_number")
        hit_numbers[i].style.paddingLeft = "0.3em";

    // NEW: send client timings back to us
    time_E = new Date().getTime() - time_E;
    if (1)
    {
      var params =     "query="  + authorQuery
                    + "&types="  + "P"
                    + "&time_D=" + time_D
                    + "&time_E=" + time_E;
      if (window.XMLHttpRequest) {
          xmlhttp = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      if (xmlhttp) 
      {
        //xmlhttp.open("POST", "http://dblp.mpi-inf.mpg.de/dblp-mirror/client_measurement.php", true);
        xmlhttp.open("POST", "http://www.informatik.uni-trier.de/~ley/dblp.mpi-inf.mpg.de/dblp-mirror/client_measurement.php", true);
        xmlhttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        xmlhttp.onreadystatechange = function() { };
        xmlhttp.send(params);
      }
    }

}

function hideFacetBoxes()
{
  document.getElementById('sidebar').style.display = "none";
}

function getFacetsURL() {
  return "http://www.informatik.uni-trier.de/~ley/dblp.mpi-inf.mpg.de/dblp-mirror/facetboxes.php?query=" + authorQuery;
  //return "http://www.informatik.uni-trier.de/~ley/dblp.mpi-inf.mpg.de/dblp-mirror/facetboxes.php?autocomplete_query=" + authorQuery;
  //return "http://www.informatik.uni-trier.de/~ley/db/indices/a-tree/dblp.mpi-inf.mpg.de/dblp-mirror/facetboxes.php?autocomplete_query=" + authorQuery + ":";
}

function getFacetBoxes() 
{
  authorQuery = getQueryFromUrl();
  xmlhttp = null;
  if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (xmlhttp) {
      var url = getFacetsURL();
      // make sure it's utf8 (hack from http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html)
      // doesn't work with IE otherwise when query contains ascii codes > 128
      if (window.ActiveXObject) { url = unescape(encodeURIComponent(url)); }
      time_D = new Date().getTime();
      xmlhttp.open("GET", url, true);
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              showFacetBoxes(xmlhttp.responseText);
          }
      }
      xmlhttp.send(null);
  }
}


