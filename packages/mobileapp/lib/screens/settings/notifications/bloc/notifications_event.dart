part of 'notifications_bloc.dart';

@immutable
abstract class NotificationsEvent {}

class NotificationsTopicSwitchedOn extends NotificationsEvent {}

class NotificationsTopicSwitchedOff extends NotificationsEvent {}
