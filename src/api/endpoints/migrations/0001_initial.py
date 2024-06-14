# Generated by Django 5.0.6 on 2024-06-13 06:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('name_spanish', models.CharField(max_length=100)),
                ('hit_dice', models.IntegerField()),
                ('saving_throws', models.JSONField(default=dict)),
                ('weapons_competition', models.JSONField(default=dict)),
                ('armor_competition', models.JSONField(default=dict)),
                ('proficiency_tools', models.JSONField(default=dict)),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('name_spanish', models.CharField(max_length=50)),
                ('script', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level_number', models.IntegerField()),
                ('features', models.JSONField(default=dict)),
                ('class_belonging', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='levels', to='endpoints.class')),
            ],
        ),
        migrations.CreateModel(
            name='Race',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('name_spanish', models.CharField(max_length=100)),
                ('bonus_stats', models.JSONField(default=dict)),
                ('speed', models.IntegerField()),
                ('night_vision', models.BooleanField()),
                ('distance_night_vision', models.IntegerField(blank=True, null=True)),
                ('languages', models.ManyToManyField(to='endpoints.language')),
            ],
        ),
    ]
