import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:settings_repository/settings_repository.dart';

part 'notifications_event.dart';
part 'notifications_state.dart';

// final Map<NotificationTopics, HiveNotificationsKeys> topicsToKeysMap = {
//   NotificationTopics.onAuctionEnd:
//       HiveNotificationsKeys.notificationOnAuctionEnd,
//   NotificationTopics.fiveMinutesBeforeEnd:
//       HiveNotificationsKeys.notificationFiveMinBeforeEnd,
//   NotificationTopics.tenMinutesBeforeEnd:
//       HiveNotificationsKeys.notificationTenMinBeforeEnd,
// };

// final Map<HiveNotificationsKeys, NotificationTopics> keysToTopicsMap =
//     topicsToKeysMap.map((k, v) => MapEntry(v, k));

class NotificationsBloc extends Bloc<NotificationsEvent, NotificationsState> {
  NotificationsBloc({
    required NotificationsRepository notificationsRepository,
    required SettingsRepository settingsRepository,
  })  : _notificationsRepository = notificationsRepository,
        _settingsRepository = settingsRepository,
        super(NotificationsInitial()) {
    on<NotificationsOpened>(_onNotificationsSettingsOpened);
    on<NotificationsTopicStateChanged>(_onTopicStateChanged);
  }

  final NotificationsRepository _notificationsRepository;
  final SettingsRepository _settingsRepository;

  void _onNotificationsSettingsOpened(
    NotificationsOpened event,
    Emitter<NotificationsState> emit,
  ) async {
    DbNotificationsState dbState = await _settingsRepository.load();

    // NotificationsStateLoadSuccess state = NotificationsStateLoadSuccess(
    //   onAuctionEndState: dbState[HiveKeys.notificationOnAuctionEnd]!,
    //   fiveMinutesBeforeEndState:
    //       dbState[HiveKeys.notificationFiveMinBeforeEnd]!,
    //   tenMinutesBeforeEndState: dbState[HiveKeys.notificationTenMinBeforeEnd]!,
    // );
    emit(NotificationsStateLoadSuccess(dbState));
  }

  void _onTopicStateChanged(
    NotificationsTopicStateChanged event,
    Emitter<NotificationsState> emit,
  ) async {
    if (event.value) {
      _notificationsRepository.subscribeToTopic(event.topic).then((_) {
        // TODO: update db state
        // if (topicsToKeysMap.containsKey(event.topic)) {
        //   _settingsRepository
        //       .update(
        //     topicsToKeysMap[event.topic]!,
        //     event.value,
        //   )
        //       .then((dbState) {
        //     Map<NotificationTopics, bool> state = {};
        //     dbState.forEach((key, value) {
        //       if (keysToTopicsMap.containsKey(key)) {
        //         state.addAll({keysToTopicsMap[key]!: value});
        //       }
        //     });
        //     emit(NotificationsStateLoadSuccess(state));
        //   });
        // }
      }).onError((error, stackTrace) {
        emit(NotificationsStateUpdateFailure());
      });
    } else {
      _notificationsRepository.unsubscribeFromTopic(event.topic).then((_) {
        // TODO: update db state
        // if (topicsToKeysMap.containsKey(event.topic)) {
        //   _settingsRepository
        //       .update(
        //     topicsToKeysMap[event.topic]!,
        //     event.value,
        //   )
        //       .then((dbState) {
        //     Map<NotificationTopics, bool> state = {};
        //     dbState.forEach((key, value) {
        //       if (keysToTopicsMap.containsKey(key)) {
        //         state.addAll({keysToTopicsMap[key]!: value});
        //       }
        //     });
        //     emit(NotificationsStateLoadSuccess(state));
        //   });
        // }
      }).onError((error, stackTrace) {
        emit(NotificationsStateUpdateFailure());
      });
    }
  }
}
