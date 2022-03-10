part of 'notifications_bloc.dart';

extension NotificationsStatusX on NotificationsStatus {
  bool get isSuccess => [
        NotificationsStatus.success,
      ].contains(this);

  bool get isInitial => [
        NotificationsStatus.initial,
      ].contains(this);

  bool get isError => [
        NotificationsStatus.updateFailure,
      ].contains(this);
}

enum NotificationsStatus { initial, success, updateFailure }

class NotificationsState extends Equatable {
  const NotificationsState({
    this.status = NotificationsStatus.initial,
    this.onAuctionEnd = false,
    this.fiveMinutesBeforeEnd = false,
    this.tenMinutesBeforeEnd = false,
  });

  final NotificationsStatus status;
  final bool onAuctionEnd;
  final bool fiveMinutesBeforeEnd;
  final bool tenMinutesBeforeEnd;

  // NotificationsState({
  //   required this.onAuctionEnd,
  //   required this.fiveMinutesBeforeEnd,
  //   required this.tenMinutesBeforeEnd,
  // });

  @override
  List<Object> get props => [
        status,
        onAuctionEnd,
        fiveMinutesBeforeEnd,
        tenMinutesBeforeEnd,
      ];

  NotificationsState copyWith({
    NotificationsStatus? status,
    bool? onAuctionEnd,
    bool? fiveMinutesBeforeEnd,
    bool? tenMinutesBeforeEnd,
  }) {
    return NotificationsState(
      status: status ?? this.status,
      onAuctionEnd: onAuctionEnd ?? this.onAuctionEnd,
      fiveMinutesBeforeEnd: fiveMinutesBeforeEnd ?? this.fiveMinutesBeforeEnd,
      tenMinutesBeforeEnd: tenMinutesBeforeEnd ?? this.tenMinutesBeforeEnd,
    );
  }
}

// class NotificationsInitial extends NotificationsState {
//   @override
//   List<Object> get props => [];
// }

// class NotificationsStateLoadSuccess extends NotificationsState {}

// class NotificationsStateLoadFailure extends NotificationsState {
//   @override
//   List<Object> get props => [];
// }

// class NotificationsStateUpdateFailure extends NotificationsState {
//   @override
//   List<Object> get props => [];
// }
