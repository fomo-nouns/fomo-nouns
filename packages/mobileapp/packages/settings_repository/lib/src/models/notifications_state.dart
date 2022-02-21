import 'package:hive/hive.dart';

part 'notifications_state.g.dart';

@HiveType(typeId: 1)
class DbNotificationsState {
  @HiveField(0)
  bool onAuctionEnd;

  @HiveField(1)
  bool fiveMinBeforeEnd;

  @HiveField(2)
  bool tenMinBeforeEnd;

  DbNotificationsState({
    required this.onAuctionEnd,
    required this.fiveMinBeforeEnd,
    required this.tenMinBeforeEnd,
  });
}
