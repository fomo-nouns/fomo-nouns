import 'package:equatable/equatable.dart';
import 'package:hive/hive.dart';

part 'notifications_state.g.dart';

@HiveType(typeId: 1)
class DbNotificationsState extends Equatable {
  @HiveField(0)
  final bool onAuctionEnd;

  @HiveField(1)
  final bool fiveMinBeforeEnd;

  @HiveField(2)
  final bool tenMinBeforeEnd;

  DbNotificationsState({
    required this.onAuctionEnd,
    required this.fiveMinBeforeEnd,
    required this.tenMinBeforeEnd,
  });

  @override
  List<Object> get props => [onAuctionEnd, fiveMinBeforeEnd, tenMinBeforeEnd];

  DbNotificationsState copyWith({
    bool? onAuctionEnd,
    bool? fiveMinBeforeEnd,
    bool? tenMinBeforeEnd,
  }) {
    return DbNotificationsState(
      onAuctionEnd: onAuctionEnd ?? this.onAuctionEnd,
      fiveMinBeforeEnd: fiveMinBeforeEnd ?? this.fiveMinBeforeEnd,
      tenMinBeforeEnd: tenMinBeforeEnd ?? this.tenMinBeforeEnd,
    );
  }
}
