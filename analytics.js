window.heap=window.heap||[],heap.load=function(e,t){
  window.heap.appid=e,heap.config=t=t||{};
  var r=document.createElement("script");
  r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";
  var a=document.getElementsByTagName("script")[0];
  a.parentNode.insertBefore(r,a);
  for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},
  p=["addEventProperties","addUserProperties","clearEventProperties","identify","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)
  n(p[o])};
  heap.load("3713320489");
