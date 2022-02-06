import 'package:flutter/widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/screens/settings/notifications/notifications.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';

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
            children: const [
              NotificationsSection(),
            ],
          ),
        ),
      ),
    );
  }
}
