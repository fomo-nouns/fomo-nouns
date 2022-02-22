import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:settings_repository/settings_repository.dart';

part 'notifications_event.dart';
part 'notifications_state.dart';

class NotificationsBloc extends Bloc<NotificationsEvent, NotificationsState> {
  NotificationsBloc({
    required NotificationsRepository notificationsRepository,
    required SettingsRepository settingsRepository,
  })  : _notificationsRepository = notificationsRepository,
        _settingsRepository = settingsRepository,
        super(const NotificationsState()) {
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

    emit(NotificationsState(
      status: NotificationsStatus.success,
      onAuctionEnd: dbState.onAuctionEnd,
      fiveMinutesBeforeEnd: dbState.fiveMinBeforeEnd,
      tenMinutesBeforeEnd: dbState.tenMinBeforeEnd,
    ));
  }

  void _onTopicStateChanged(
    NotificationsTopicStateChanged event,
    Emitter<NotificationsState> emit,
  ) async {
    DbNotificationsState newDbState = DbNotificationsState(
      onAuctionEnd: event.topic == NotificationTopics.onAuctionEnd
          ? event.value
          : state.onAuctionEnd,
      fiveMinBeforeEnd: event.topic == NotificationTopics.fiveMinutesBeforeEnd
          ? event.value
          : state.fiveMinutesBeforeEnd,
      tenMinBeforeEnd: event.topic == NotificationTopics.tenMinutesBeforeEnd
          ? event.value
          : state.tenMinutesBeforeEnd,
    );

    if (event.value) {
      _notificationsRepository.subscribeToTopic(event.topic).then((_) {
        _settingsRepository.update(newDbState).then((dbState) {
          emit(NotificationsState(
            status: NotificationsStatus.success,
            onAuctionEnd: dbState.onAuctionEnd,
            fiveMinutesBeforeEnd: dbState.fiveMinBeforeEnd,
            tenMinutesBeforeEnd: dbState.tenMinBeforeEnd,
          ));
        });
      }).onError((error, stackTrace) {
        emit(state.copyWith(status: NotificationsStatus.updateFailure));
      });
    } else {
      _notificationsRepository.subscribeToTopic(event.topic).then((_) {
        _settingsRepository.update(newDbState).then((dbState) {
          emit(NotificationsState(
            status: NotificationsStatus.success,
            onAuctionEnd: dbState.onAuctionEnd,
            fiveMinutesBeforeEnd: dbState.fiveMinBeforeEnd,
            tenMinutesBeforeEnd: dbState.tenMinBeforeEnd,
          ));
        });
      }).onError((error, stackTrace) {
        emit(state.copyWith(status: NotificationsStatus.updateFailure));
      });
    }
  }
}
