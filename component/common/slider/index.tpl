

{% for item in slider %}
    <li>
        <a href="{{ item.url }}">
            <img src="{{ item.image }}" alt="{{ item.title }}">
        </a>
    </li>
{% endfor %}