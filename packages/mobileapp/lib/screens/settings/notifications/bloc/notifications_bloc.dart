import 'package:bloc/bloc.dart';
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
        super(NotificationsInitial()) {
    on<NotificationsEvent>((event, emit) {
      // TODO: implement event handler
    });
  }

  NotificationsRepository _notificationsRepository;
  SettingsRepository _settingsRepository;
}
