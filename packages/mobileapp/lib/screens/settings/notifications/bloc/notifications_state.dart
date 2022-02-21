part of 'notifications_bloc.dart';

@immutable
abstract class NotificationsState extends Equatable {}

class NotificationsInitial extends NotificationsState {
  @override
  List<Object> get props => [];
}

class NotificationsStateLoadSuccess extends NotificationsState {
  final DbNotificationsState state;

  NotificationsStateLoadSuccess(this.state);

  @override
  List<Object> get props => [state];
  // final bool onAuctionEndState;
  // final bool fiveMinutesBeforeEndState;
  // final bool tenMinutesBeforeEndState;

  // NotificationsStateLoadSuccess({
  //   required this.onAuctionEndState,
  //   required this.fiveMinutesBeforeEndState,
  //   required this.tenMinutesBeforeEndState,
  // });
}

class NotificationsStateLoadFailure extends NotificationsState {
  @override
  List<Object> get props => [];
}

class NotificationsStateUpdateFailure extends NotificationsState {
  @override
  List<Object> get props => [];
}
