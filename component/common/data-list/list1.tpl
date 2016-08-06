<% 
var keys = [];
for(var i in data){
    keys.push(i);
} %>
<div id="list1-left" class="list-left"><ul>
<% for(var j = 0 , len = keys.length ; j < len ; j++ ){ %>
    <li id="list1_<%= j %>_l" class="left"><%= keys[j] %><i class="ui-icon-arrow left-icon"></i></li>
   
<% } %>
</ul></div>
<div id="list1-right" class="list-right">
<% for(var p = 0 , len = keys.length ; p < len ; p++ ){ %>
        <ul id="list1_<%= p %>_r" class="right">
       <% for(var q = 0 , len2 = data[keys[p]].length ; q < len2 ; q++){ %>
            <li><%= data[keys[p]][q] %></li>

     <%  } %>
     </ul>  
  <% } %>
</div>