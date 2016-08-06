

{% for item in data.comment %}
    <li class="ui-border-t">
        <div class="ui-avatar-tiled">
            <span style="background-image:url({{ item.avatar }})"></span>
        </div>
        <div class="ui-list-info">
            <p class="ui-nowrap"><span class="name">{{ item.name }}</span><small>{{ item.school }}</small></p>
            <p class="ui-nowrap"><small>{{ item.time }}</small></p>
            <p class="comment">
            {% if item.type === 0 %}
                回复<span class="name">{{ item.name }}</span>
            {% endif %}
            {{ item.content }}</p>
        </div>
    </li>
{% endfor %}
