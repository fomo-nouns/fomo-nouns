part of 'notifications_bloc.dart';

extension NotificationsStatusX on NotificationsStatus {
  bool get isSuccess => this == NotificationsStatus.success;
  bool get isInitial => this == NotificationsStatus.initial;
  bool get isError => this == NotificationsStatus.updateFailure;
}

enum NotificationsStatus { initial, success, updateFailure }

@JsonSerializable()
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

  factory NotificationsState.fromJson(Map<String, dynamic> json) =>
      _$NotificationsStateFromJson(json);

  Map<String, dynamic> toJson() => _$NotificationsStateToJson(this);
}
