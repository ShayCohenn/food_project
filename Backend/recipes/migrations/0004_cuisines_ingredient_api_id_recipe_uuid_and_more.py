# Generated by Django 4.2.3 on 2023-09-18 08:28

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0003_ingredient_api_id_recipe_uuid_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cuisines',
            fields=[
                ('cuisine', models.CharField(default='other', max_length=30, primary_key=True, serialize=False)),
                ('flag', models.TextField(default='https://firebasestorage.googleapis.com/v0/b/food-project-8d454.appspot.com/o/flags%2FTransparent_flag_with_question_mark.png?alt=media&token=a71145f7-0394-4a85-b0cd-0d20253335c3')),
            ],
        )
    ]
