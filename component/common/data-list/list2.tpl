<% 
var keys = [];
for(var i in data){
    keys.push(i);   
} %>
<div id="list2-left" class="list-left"><ul>
<% for(var j = 0 , len = keys.length ; j < len ; j++ ){ %>
    <li id="list2_<%= j %>_l" class="left"><%= keys[j] %><i class="ui-icon-arrow left-icon"></i></li>
   
<% } %>
</ul></div>
<div id="list2-right" class="list-right">
<% for(var p = 0 , len = keys.length ; p < len ; p++ ){ %>
        <ul id="list2_<%= p %>_r" class="right">
       <% for(var q = 0 , len2 = data[keys[p]].length ; q < len2 ; q++){ %>
            <li><%= data[keys[p]][q]%></li>

     <%  } %>
     </ul>  
  <% } %>
</div>