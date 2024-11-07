from django.db import models

class Item(models.Model):
    email = models.EmailField(max_length=255, unique=True)  # Stores the email
    events_list = models.JSONField(default=list, blank=True)  # Stores a list of event objects in JSON format

    def __str__(self):
        return self.email
