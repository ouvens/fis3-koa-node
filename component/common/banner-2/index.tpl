
{% for item in banner2 %}
    <li class="ui-border-t">
        <div class="ui-list-img">
            <img src="{{ item.image }}" alt="{{item.title}}" width="60" height="60">
        </div>
        <div class="ui-list-info">
            <p class="ui-nowrap">{{item.title}}</p>
            <p class="ui-nowrap">{{item.title}}</p>
        </div>
    </li>
{% endfor %}