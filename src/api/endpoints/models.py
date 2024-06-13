from django.db import models

class Language(models.Model):
    name= models.CharField(max_length=50)
    name_spanish =models.CharField(max_length=50)
    script = models.CharField(max_length=50, null=True, blank=True)

class Race(models.Model):
    name = models.CharField(max_length=100)
    name_spanish = models.CharField(max_length=100)
    bonus_stats = models.JSONField(default=dict)
    speed = models.IntegerField()
    night_vision = models.BooleanField()
    distance_night_vision = models.IntegerField(null=True, blank=True)
    languages = models.ManyToManyField(Language)

class Class(models.Model):
    name =models.CharField(max_length=100)
    name_spanish = models.CharField(max_length=100)
    hit_dice = models.IntegerField()
    saving_throws = models.JSONField(default=dict)
    weapons_competition = models.JSONField(default=dict)
    armor_competition = models.JSONField(default=dict)
    proficiency_tools = models.JSONField(default=dict)

class Level(models.Model):
    class_belonging = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='levels')
    level_number = models.IntegerField()
    features = models.JSONField(default=dict)