part of 'notifications_bloc.dart';

@immutable
abstract class NotificationsState {}

class NotificationsInitial extends NotificationsState {}

class NotificationsStateLoadSuccess extends NotificationsState {
  final Map<NotificationTopics, bool> state;

  NotificationsStateLoadSuccess(this.state);
}

class NotificationsStateLoadFailure extends NotificationsState {}

class NotificationsStateUpdateFailure extends NotificationsState {}
