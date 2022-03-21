part of 'notifications_bloc.dart';

@immutable
abstract class NotificationsEvent {}

class NotificationsTopicStateChanged extends NotificationsEvent {
  final NotificationTopics topic;
  final bool value;

  NotificationsTopicStateChanged({required this.topic, required this.value});
}
