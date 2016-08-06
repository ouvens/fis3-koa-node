<li>
    <ul class="page">

    {% for item in pageMenu %}
        
        {% if loop.index > 0 && loop.index % 8 == 0 %}
            </ul>
        </li>
        <li>
            <ul class="page">
        {% endif %}

        <li class="page-item {% if loop.first %}first{% else %}{{loop.index}}{% endif %}" data-href="{{ item.url }}">
            <span class="page-item-bd {{ item.icon }}" style="background-image:url(http://placeholder.qiniudn.com/100x100)"></span>
            <span class="page-item-ft">{{ item.title }}</span>
        </li>
    {% endfor %}
    </ul>

</li>