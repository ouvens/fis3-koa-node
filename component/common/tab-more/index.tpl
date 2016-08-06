
{% for item in tabMore.list %}
    <li class="ui-border-t" data-href="item.url">
        <div class="ui-list-img">
            <img src="{{ item.image }}" alt="{{ item.title }}" width="90" height="70">
        </div>
        <div class="ui-list-info">
            <h4>{{ item.title }}</h4>
        </div>
    </li>
{% endfor %}