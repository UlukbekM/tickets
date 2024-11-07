from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from base.models import Item
from .serializers import ItemSerializer, AddIdSerializer

@api_view(['GET'])
def getData(request):
    items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addItem(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

# Update an existing item
@api_view(['PUT'])
def updateItem(request, pk):
    try:
        item = Item.objects.get(id=pk)
    except Item.DoesNotExist:
        return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ItemSerializer(item, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete an item
@api_view(['DELETE'])
def deleteItem(request, pk):
    try:
        item = Item.objects.get(id=pk)
    except Item.DoesNotExist:
        return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

    item.delete()
    return Response({'message': 'Item deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)



@api_view(['GET'])
def getItemByEmail(request):
    # Extract the email from the query parameters
    email = request.query_params.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Try to find the item by email
    try:
        item = Item.objects.get(email=email)
    except Item.DoesNotExist:
        return Response({'message': 'No item found for that email.'}, status=status.HTTP_200_OK)

    # Serialize the found item
    # serializer = ItemSerializer(item)
    # return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'events_list': item.events_list}, status=status.HTTP_200_OK)


@api_view(['POST'])
def addEventByEmail(request):
    # print(request.data)  # Debugging: Print the incoming data
    email = request.data.get('email')
    new_event = request.data.get('event')  # Expecting an event object with id, date, venue, artist

    if not email or not new_event:
        return Response({'error': 'Email and event data are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        item = Item.objects.get(email=email)

        # Ensure current_events is a list of dictionaries
        current_events = item.events_list if isinstance(item.events_list, list) else []

        # Check if current_events contains dictionaries and handle accordingly
        if not isinstance(current_events, list) or any(not isinstance(event, dict) for event in current_events):
            current_events = []

        # Check if the new_event ID already exists
        if not any(event.get('id') == new_event['id'] for event in current_events):
            current_events.append(new_event)  # Append new event
            item.events_list = current_events
            item.save()
        else:
            return Response({'error': 'Event with this ID already exists'}, status=status.HTTP_400_BAD_REQUEST)

    except Item.DoesNotExist:
        # If the item with the given email doesn't exist, create a new one with the event
        item = Item.objects.create(email=email, events_list=[new_event])

    serializer = ItemSerializer(item)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
def removeIdByEmail(request):
    # Extract email and id from request data
    email = request.data.get('email')
    remove_id = request.data.get('id')
    
    if not email or not remove_id:
        return Response({'error': 'Email and ID are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Find the item by email
    try:
        item = Item.objects.get(email=email)
    except Item.DoesNotExist:
        return Response({'error': 'Item with this email not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Remove the object with the matching id from events_list
    current_events = item.events_list
    updated_events = [event for event in current_events if event.get('id') != remove_id]

    if len(updated_events) == len(current_events):
        return Response({'error': 'ID not found in events list'}, status=status.HTTP_404_NOT_FOUND)

    # Update the events list and save the item
    item.events_list = updated_events
    item.save()
    
    return Response({'events_list': updated_events}, status=status.HTTP_200_OK)

    # Serialize the updated item
    # serializer = ItemSerializer(item)
    # return Response(serializer.data, status=status.HTTP_200_OK)