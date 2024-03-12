from django.urls import include,path

from . import views

app_name = "polls"
urlpatterns = [
    path("__debug__/", include("debug_toolbar.urls")),
    path('create_poll/', views.create_poll, name='create_poll'),
    path('get_polls/', views.get_polls, name='get_polls'),
    path('get_polls_by_tags/', views.get_polls_by_tags, name='get_polls_by_tags'),
    path('poll_id/<int:question_id>/', views.update_poll_vote, name='update_poll_vote'),
    path('pollDetailById/<int:id>/', views.getPollDetailById, name='getPollDetailById'),
    path('tags/', views.get_all_tags, name='all_tags'),
]


