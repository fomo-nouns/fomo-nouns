import 'package:bloc_concurrency/bloc_concurrency.dart';
import 'package:equatable/equatable.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:meta/meta.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:json_annotation/json_annotation.dart';

part 'notifications_event.dart';
part 'notifications_state.dart';
part 'notifications_bloc.g.dart';

class NotificationsBloc
    extends HydratedBloc<NotificationsEvent, NotificationsState> {
  NotificationsBloc(
    NotificationsRepository notificationsRepository,
  )   : _notificationsRepository = notificationsRepository,
        super(const NotificationsState()) {
    on<NotificationsTopicStateChanged>(
      _onTopicStateChanged,
      transformer: sequential(),
    );
  }

  final NotificationsRepository _notificationsRepository;

  void _onTopicStateChanged(
    NotificationsTopicStateChanged event,
    Emitter<NotificationsState> emit,
  ) async {
    if (event.value) {
      await _notificationsRepository
          .subscribeToTopic(event.topic)
          .then((_) async {
        emit(_updatedState(
          status: NotificationsStatus.success,
          topic: event.topic,
          value: event.value,
        ));
      }).timeout(const Duration(seconds: 3), onTimeout: () {
        emit(state.copyWith(status: NotificationsStatus.updateFailure));
      }).onError((error, stackTrace) {
        emit(state.copyWith(status: NotificationsStatus.updateFailure));
      });
    } else {
      await _notificationsRepository
          .unsubscribeFromTopic(event.topic)
          .then((_) async {
        emit(_updatedState(
          status: NotificationsStatus.success,
          topic: event.topic,
          value: event.value,
        ));
      }).timeout(const Duration(seconds: 3), onTimeout: () {
        emit(state.copyWith(status: NotificationsStatus.updateFailure));
      }).onError((error, stackTrace) {
        emit(state.copyWith(status: NotificationsStatus.updateFailure));
      });
    }
  }

  NotificationsState _updatedState({
    required NotificationsStatus status,
    required NotificationTopics topic,
    required bool value,
  }) {
    return NotificationsState(
      status: status,
      onAuctionEnd:
          topic == NotificationTopics.onAuctionEnd ? value : state.onAuctionEnd,
      fiveMinutesBeforeEnd: topic == NotificationTopics.fiveMinutesBeforeEnd
          ? value
          : state.fiveMinutesBeforeEnd,
      tenMinutesBeforeEnd: topic == NotificationTopics.tenMinutesBeforeEnd
          ? value
          : state.tenMinutesBeforeEnd,
    );
  }

  @override
  NotificationsState? fromJson(Map<String, dynamic> json) =>
      NotificationsState.fromJson(json);

  @override
  Map<String, dynamic>? toJson(NotificationsState state) => state.toJson();
}
