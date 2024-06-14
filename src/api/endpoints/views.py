# endpoints/views.py
from django.http import JsonResponse
from .models import Language, Race
from django.conf import settings
import os
import json

def init_data_view(request):
    try:
        language_file_path = os.path.join(settings.BASE_DIR, 'endpoints', 'txt_files', 'language.txt')
        with open(language_file_path, "r") as archive:
            for language in archive:
                name, name_spanish, script = language.strip().split(';')
                new_language = Language(
                    name=name,
                    name_spanish=name_spanish,
                    script=script
                )
                new_language.save()

        race_file_path = os.path.join(settings.BASE_DIR, 'endpoints', 'txt_files', 'races.txt')
        with open(race_file_path, "r") as archive:
            for race in archive:
                name, name_spanish, bonus_stats, speed, night_vision, distance_night_vision, languages = race.strip().split(';')
                bonus_stats = json.loads(bonus_stats)
                if distance_night_vision == " ":
                    new_race = Race(
                        name=name,
                        name_spanish=name_spanish,
                        bonus_stats=bonus_stats,
                        speed=speed,
                        night_vision=night_vision,
                    )
                else:
                    new_race = Race(
                        name=name,
                        name_spanish=name_spanish,
                        bonus_stats=bonus_stats,
                        speed=speed,
                        night_vision=night_vision,
                        distance_night_vision=distance_night_vision
                    )
                new_race.save()
                languages = languages.split(',')
                list_languages = []
                for language_name in languages:
                    language = Language.objects.get(name=language_name)
                    list_languages.append(language)
                new_race.languages.set(list_languages)

        return JsonResponse({'status': 'success', 'message': 'Languages and Races initialized successfully'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
