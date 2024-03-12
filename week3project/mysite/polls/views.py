
from django.http import Http404
from django.template import loader
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
import json


from .models import Choice, Question, Tag
from django.views import generic
from .models import Question


@csrf_exempt
def create_poll(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("data :", data)


            # Extracting question text
            question_text = data.get('Question')
            print("Question Text:", question_text)

            # Creating the question
            question = Question.objects.create(
                question_text=question_text,
                pub_date=timezone.now()
            )

            # Extracting options and creating choices
            options = data.get('OptionVote', {})
            for choice_text, votes in options.items():
                choice = Choice.objects.create(
                    question=question,
                    choice_text=choice_text,
                    votes=int(votes)
                )
                print("Choice Text:", choice_text)
                print("Votes:", votes)

            # Extracting tags and creating tags
            tags = data.get('Tags', [])
            for tag_text in tags:
                tag = Tag.objects.create(
                    tag_text=tag_text,
                    question=question
                )
                print("Tag Text:", tag_text)

            return JsonResponse({'message': 'Poll created successfully'}, status=201)
        except Exception as e:
            print("Error:", e)
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


@csrf_exempt
def get_polls(request):
    if request.method == 'GET':
        try:
            # Get all questions
            questions = Question.objects.all()

            # Initialize list to store poll data
            polls = []

            # Iterate over each question
            for question in questions:
                # Initialize dictionary for storing poll data
                poll_data = {
                    'Question': question.question_text,
                    'questionId': question.id,
                    'OptionVote': {},
                    'Tags': []
                }

                # Get choices for the current question
                choices = Choice.objects.filter(question=question)

                # Populate OptionVote dictionary
                for choice in choices:
                    poll_data['OptionVote'][choice.choice_text] = choice.votes

                # Get tags for the current question
                tags = Tag.objects.filter(question=question)

                # Populate Tags list
                for tag in tags:
                    poll_data['Tags'].append(tag.tag_text)

                # Add poll data to the polls list
                polls.append(poll_data)

            return JsonResponse(polls, safe=False)  # Set safe=False to allow serialization of lists
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
    



@csrf_exempt
def get_polls_by_tags(request):
    if request.method == 'GET':
        try:
            # Get tags from query parameters
            tags_param = request.GET.get('tags', '')
            tags = [tag.strip() for tag in tags_param.split(',') if tag.strip()]  # Split and remove empty tags

            # Filter out empty tags
            tags = [tag for tag in tags if tag]

            # If no non-empty tags are provided, return an empty response
            if not tags:
                return JsonResponse([])

            # Filter questions based on non-empty tags
            filtered_questions = Question.objects.filter(tag__tag_text__in=tags).distinct()

            # Initialize list to store filtered polls
            filtered_polls = []

            # Iterate over filtered questions
            for question in filtered_questions:
                # Initialize dictionary for storing poll data
                poll_data = {
                    'questionId': question.id,  # Add questionId to poll data
                    'Question': question.question_text,
                    'OptionVote': {},
                    'Tags': []
                }

                # Get choices for the current question
                choices = Choice.objects.filter(question=question)

                # Populate OptionVote dictionary
                for choice in choices:
                    poll_data['OptionVote'][choice.choice_text] = choice.votes

                # Get tags for the current question
                tags = Tag.objects.filter(question=question)

                # Populate Tags list
                for tag in tags:
                    poll_data['Tags'].append(tag.tag_text)

                # Add poll data to the filtered polls list
                filtered_polls.append(poll_data)

            return JsonResponse(filtered_polls, safe=False)  # Set safe=False to allow serialization of lists
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)



@csrf_exempt
def update_poll_vote(request, question_id):  # Change `poll_id` to `question_id`
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            print('data:', data)  
            increment_option = data.get('incrementOption')
            print('increment_option:', increment_option)  
            
            # Get the question object
            question = get_object_or_404(Question, pk=question_id)
            print('question:', question)  
            
            # Get the choice object related to the question and matching the choice_text
            choice = get_object_or_404(Choice, question=question, choice_text=increment_option)
            print('choice:', choice)  
            
            # Increment the vote count for the choice
            choice.votes += 1
            choice.save()
            print('choice votes after save:', choice.votes)  

            return JsonResponse({'message': 'Poll vote updated successfully'}, status=200)
        except Choice.DoesNotExist:
            return JsonResponse({'error': 'Choice does not exist'}, status=404)
        except Question.DoesNotExist:
            return JsonResponse({'error': 'Question does not exist'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only PUT requests are allowed'}, status=405)
   

def getPollDetailById(request, id):
    try:
        question = Question.objects.get(pk=id)
    except Question.DoesNotExist:
        return JsonResponse({"error": "Question does not exist"}, status=404)

    choices = question.choice_set.all()
    tags = question.tag_set.all()

    option_vote = {choice.choice_text: choice.votes for choice in choices}
    tags_list = [tag.tag_text for tag in tags]

    poll_details = {
        "Question": question.question_text,
        "OptionVote": option_vote,
        "Tags": tags_list
    }

    return JsonResponse(poll_details) 


def get_all_tags(request):
    tags = Tag.objects.values_list('tag_text', flat=True).distinct()
    tags_list = list(tags)

    response_data = {
        "Tags": tags_list
    }

    return JsonResponse(response_data)

            












































