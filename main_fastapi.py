#!/usr/bin/env python

import json
import urllib.parse

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

import fixtures
import blog
from ws import ws
from database import init_db
from gameon.gameon_routes import router as gameon_router


class GameOnUtils:
    class MyEncoder(json.JSONEncoder):
        def default(self, obj):
            if hasattr(obj, '__dict__'):
                return obj.__dict__
            return json.JSONEncoder.default(self, obj)


FACEBOOK_APP_ID = "138831849632195"

app = FastAPI()

from fastapi.responses import RedirectResponse as _Redir

@app.middleware("http")
async def legacy_domain_redirect(request, call_next):
    host = request.headers.get("host", "").split(":")[0].lower()
    if host == "rewordgame.com" or host == "www.rewordgame.com":
        url = "https://rewordgame.v5games.com" + request.url.path
        if request.url.query:
            url += "?" + request.url.query
        return _Redir(url, status_code=301)
    return await call_next(request)
templates = Jinja2Templates(directory=".")


@app.middleware("http")
async def add_cache_control(request: Request, call_next):
    response = await call_next(request)
    if response.headers.get("content-type", "").startswith("text/html"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response


@app.on_event("startup")
async def startup_event():
    init_db()


app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/gameon/static", StaticFiles(directory="gameon/static"), name="gameon_static")
app.include_router(gameon_router)


def get_template_values(request: Request, **kwargs):
    return {
        'request': request,
        'fixtures': fixtures,
        'ws': ws,
        'json': json,
        'GameOnUtils': GameOnUtils,
        'url': str(request.url),
        'host': request.url.hostname,
        'host_url': f"{request.url.scheme}://{request.url.netloc}",
        'path': request.url.path,
        'urlencode': urllib.parse.quote_plus,
        **kwargs
    }


@app.get('/', response_class=HTMLResponse)
async def index(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))


@app.get('/tests', response_class=HTMLResponse)
async def tests(request: Request):
    return templates.TemplateResponse('templates/tests.jinja2', get_template_values(request))


@app.get('/facebook', response_class=HTMLResponse)
async def facebook(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))


@app.get('/contact', response_class=HTMLResponse)
async def contact(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/contact.jinja2', get_template_values(request, noads=noads))


@app.get('/about', response_class=HTMLResponse)
async def about(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/about.jinja2', get_template_values(request, noads=noads))


@app.get('/privacy-policy')
async def privacy_policy_redirect():
    return RedirectResponse(url='/privacy', status_code=301)


@app.get('/privacy', response_class=HTMLResponse)
async def privacy(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/privacy.jinja2', get_template_values(request, noads=noads))


@app.get('/terms', response_class=HTMLResponse)
async def terms(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/terms.jinja2', get_template_values(request, noads=noads))


@app.get('/versus', response_class=HTMLResponse)
async def versus(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/versus.jinja2', get_template_values(request, noads=noads))


@app.get('/versus/{subpath:path}', response_class=HTMLResponse)
async def versus_sub(request: Request, subpath: str, noads: bool = False):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))


@app.get('/timed', response_class=HTMLResponse)
async def timed(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))


@app.get('/multiplayer', response_class=HTMLResponse)
async def multiplayer(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/versus.jinja2', get_template_values(request, noads=noads))


@app.get('/games-multiplayer', response_class=HTMLResponse)
async def games_multiplayer(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=noads))


@app.get('/games', response_class=HTMLResponse)
async def games(request: Request):
    return templates.TemplateResponse('templates/index.jinja2', get_template_values(request, noads=True))


@app.get('/play', response_class=HTMLResponse)
async def play(request: Request, noads: bool = False):
    return templates.TemplateResponse('templates/campaign.jinja2', get_template_values(request, noads=noads))


@app.get('/blog', response_class=HTMLResponse)
async def blog_index(request: Request):
    return templates.TemplateResponse('templates/blog.jinja2', get_template_values(request, noads=True, post=None, posts=blog.POSTS))


@app.get('/blog/{slug}', response_class=HTMLResponse)
async def blog_post(request: Request, slug: str):
    post = blog.BY_SLUG.get(slug)
    if not post:
        return HTMLResponse('Not found', status_code=404)
    ld = json.dumps({
        '@context': 'https://schema.org', '@type': 'Article', 'headline': post['title'],
        'description': post['description'], 'datePublished': post['date'], 'dateModified': post['date'],
        'inLanguage': 'en', 'image': 'https://rewordgame.v5games.com/static/img/og-reword.png',
        'mainEntityOfPage': 'https://rewordgame.v5games.com/blog/' + slug,
        'author': {'@type': 'Organization', 'name': 'reWord Game'},
        'publisher': {'@type': 'Organization', 'name': 'Addicting Word Games', 'url': 'https://addictingwordgames.com'},
    }).replace('</', '<\\/')
    return templates.TemplateResponse('templates/blog.jinja2', get_template_values(
        request, noads=True, post=post, posts=blog.POSTS, post_body=blog.body(slug), article_ld=ld))


def render_sitemap(request: Request):
    content = templates.get_template('sitemap.xml').render(get_template_values(request, posts=blog.POSTS))
    return Response(content=content, media_type='text/xml')


@app.get('/sitemap')
async def sitemap(request: Request):
    return render_sitemap(request)


@app.get('/sitemap.xml')
async def sitemap_xml(request: Request):
    return render_sitemap(request)


@app.get('/robots.txt')
async def robots_txt(request: Request):
    content = f"User-agent: *\nDisallow:\nSitemap: {request.url.scheme}://{request.url.netloc}/sitemap.xml\n"
    return Response(content=content, media_type='text/plain')


@app.get('/manifest.webapp')
async def manifest_webapp():
    with open('manifest/manifest.json', 'r') as f:
        return Response(content=f.read(), media_type='application/json')


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=9332)
