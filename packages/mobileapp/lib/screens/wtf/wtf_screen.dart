import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';

import '../../main.dart';

class WtfScreen extends StatelessWidget {
  const WtfScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialWidget(
        child: ValueListenableBuilder<Box<NotificationMessage>>(
      valueListenable:
          Hive.box<NotificationMessage>('notifications_test').listenable(),
      builder: (context, box, widget) {
        return ListView.builder(
          itemCount: box.length,
          itemBuilder: (context, listIndex) {
            return Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                children: [
                  Container(
                    height: 1,
                    color: AppColors.black,
                  ),
                  Text(
                      box.getAt(listIndex)?.notificationTitle ?? "error_title"),
                  Text(
                    box
                            .getAt(listIndex)
                            ?.sendTime
                            ?.toLocal()
                            .toIso8601String() ??
                        "error",
                  ),
                  Text(box.getAt(listIndex)?.from ?? "error"),
                  Text(box.getAt(listIndex)?.messageId ?? "error"),
                  // Text(box.getAt(listIndex)?.notificationBody ?? "error"),
                ],
              ),
            );
          },
        );
      },
    )
        // Center(
        //   child: Text("Wtf Screen"),
        // ),
        );
  }
}
