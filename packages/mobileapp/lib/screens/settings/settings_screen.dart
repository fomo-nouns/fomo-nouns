import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/screens/settings/notifications/bloc/notifications_bloc.dart';
import 'package:mobileapp/screens/settings/notifications/notifications.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:settings_repository/settings_repository.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialWidget(
      child: SafeArea(
        child: Padding(
          padding: EdgeInsets.only(
            top: 30.w,
          ),
          child: Column(
            children: [
              BlocProvider(
                create: (BuildContext context) => NotificationsBloc(
                  notificationsRepository:
                      context.read<NotificationsRepository>(),
                  settingsRepository: context.read<SettingsRepository>(),
                )..add(NotificationsOpened()),
                child: const NotificationsSection(),
              )
            ],
          ),
        ),
      ),
    );
  }
}
