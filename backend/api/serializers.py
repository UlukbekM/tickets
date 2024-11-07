from rest_framework import serializers
from base.models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class AddIdSerializer(serializers.Serializer):
    email = serializers.EmailField()
    id = serializers.IntegerField()

    def update(self, instance, validated_data):
        new_id = validated_data.get('id')

        # Add the new ID if it's not already in the list
        if new_id not in instance.ids_list:
            instance.ids_list.append(new_id)
            instance.save()

        return instance