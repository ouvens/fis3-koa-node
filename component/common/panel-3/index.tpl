
<h2 class="ui-arrowlink" data-href="{{ panel3.url }}">
    {{ panel3.title }}<span class="ui-panel-subtitle">{{ panel3.total || 0 }}条</span>
</h2>
<ul class="ui-grid-trisect">
    {% for item in panel3.list %}
    <li>
        <div class="ui-border">
            <div class="ui-grid-trisect-img">
                <a href="{{ item.url }}">
                    <img src="{{ item.image }}" alt="">
                </a>
            </div>
            <div>
                <h4 class="ui-nowrap-multi">{{ item.title }}</h4>
                <h5 class="ui-nowrap">{{ item.desc }}</h5>
            </div>
        </div>
    </li>
    {% endfor %}
</ul>