# Generated by Django 5.1.2 on 2024-10-21 19:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_remove_item_created_remove_item_name_item_email_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='item',
            old_name='ids_list',
            new_name='events_list',
        ),
    ]
