
{% for item in tabRecmend.list %}
    <li class="ui-border-t" data-href="{{ item.url }}">
        <div class="ui-list-img">
            <a href="{{ item.url }}">
                <img src="{{ item.image }}" alt="{{ item.title }}" width="90" height="70">
            </a>
        </div>
        <div class="ui-list-info">
            <h4 class="ui-nowrap">{{ item.title }}</h4>
            <p class="ui-nowrap">{{ item.desc }}</p>
        </div>
    </li>
{% endfor %}