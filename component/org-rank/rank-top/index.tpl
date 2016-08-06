
{% for item in data.rankList %}
    {% if loop.index < 4 %}
    <li class="rank-top-list ui-border-b {% if loop.index === 1 %}top-first{% endif %}">
        <h4>No {{ loop.index }}</h4>
        <div class="ui-avatar-one"><span style="background-image:url({{ item.logo }})"></span></div>
        <div class="desc">
            <h2>{{ item.name }}</h2>
            <h5><span>动态:{{ item.msg }}</span> / <span>关注:{{ item.follow }}</span></h5>
            <div class="ui-sign"><span class="number">{{ item.sign }}</span>人签到</div>
        </div>
    </li>
    {% endif %}
{% endfor %}