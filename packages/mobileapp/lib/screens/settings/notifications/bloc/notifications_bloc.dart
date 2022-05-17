import 'package:bloc_concurrency/bloc_concurrency.dart';
import 'package:equatable/equatable.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:meta/meta.dart';
import 'package:mobileapp/screens/shared_widgets/toast.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:json_annotation/json_annotation.dart';
import 'dart:io' show Platform;

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
    emit(state.copyWith(status: NotificationsStatus.updating));
    if (event.value) {
      if (Platform.isIOS && !state.hasActiveNotifications) {
        bool hasPermission = await _notificationsRepository.hasIOSPermission();

        if (hasPermission) {
          await _subscribeToTopic(event, emit);
        } else {
          bool status = await _notificationsRepository.requestIOSPermission();

          if (status) {
            await _subscribeToTopic(event, emit);
          } else {
            _onPermissionError(emit);
          }
        }
      } else {
        await _subscribeToTopic(event, emit);
      }
    } else {
      await _unsubscribeFromTopic(event, emit);
    }
  }

  Future<void> _subscribeToTopic(
    NotificationsTopicStateChanged event,
    Emitter<NotificationsState> emit,
  ) async {
    await _notificationsRepository
        .subscribeToTopic(event.topic)
        .then((_) async {
      emit(_updatedState(
        status: NotificationsStatus.success,
        topic: event.topic,
        value: event.value,
      ));
    }).timeout(const Duration(seconds: 3), onTimeout: () {
      _onError(emit);
    }).onError((error, stackTrace) {
      _onError(emit);
    });
  }

  Future<void> _unsubscribeFromTopic(
    NotificationsTopicStateChanged event,
    Emitter<NotificationsState> emit,
  ) async {
    await _notificationsRepository
        .unsubscribeFromTopic(event.topic)
        .then((_) async {
      emit(_updatedState(
        status: NotificationsStatus.success,
        topic: event.topic,
        value: event.value,
      ));
    }).timeout(const Duration(seconds: 3), onTimeout: () {
      _onError(emit);
    }).onError((error, stackTrace) {
      _onError(emit);
    });
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

  void _onError(Emitter<NotificationsState> emit) async {
    emit(state.copyWith(status: NotificationsStatus.updateFailure));
    showAlertToast("Couldn’t save notification preference");
  }

  void _onPermissionError(Emitter<NotificationsState> emit) async {
    emit(state.copyWith(status: NotificationsStatus.updateFailure));
    showAlertToast("Your permission is required for this :(");
  }

  @override
  NotificationsState? fromJson(Map<String, dynamic> json) =>
      NotificationsState.fromJson(json);

  @override
  Map<String, dynamic>? toJson(NotificationsState state) => state.toJson();
}
