import 'package:flutter/material.dart';
import 'package:flutter_platform_widgets/flutter_platform_widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/shared_widgets/buttons.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'dart:io' show Platform;

class HowNotificationsWorkScreen extends StatelessWidget {
  const HowNotificationsWorkScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialWidget(
      child: Container(
        color: Theme.of(context).backgroundColor,
        child: SidePadding(
          child: ListView(
            physics: const BouncingScrollPhysics(),
            children: [
              PlatformWidget(
                cupertino: (_, __) => SizedBox(height: 20.w),
                material: (_, __) => SizedBox(height: 30.w),
              ),
              GestureDetector(
                onTap: () => Navigator.of(context).pop(),
                child: Text(
                  "Close",
                  style: TextStyle(
                    fontFamily: AppFonts.londrina,
                    fontSize: 26.sp,
                    fontWeight: FontWeight.w700,
                    color: AppColors.greyOne,
                  ),
                ),
              ),
              SizedBox(height: 30.w),
              Text(
                "On auction end",
                style: TextStyle(
                  fontFamily: AppFonts.londrina,
                  fontSize: 36.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.purple,
                ),
              ),
              SizedBox(height: 10.w),
              Text(
                "Notification on the auction end is sent when the auction on a noun has ended, and voting has started, so you can jump right into playing.",
                style: TextStyle(
                  fontSize: 18.sp,
                ),
              ),
              SizedBox(height: 40.w),
              Text(
                "5 and 10 minutes before the end",
                style: TextStyle(
                  fontFamily: AppFonts.londrina,
                  fontSize: 36.sp,
                  fontWeight: FontWeight.w700,
                  color: AppColors.purple,
                ),
              ),
              SizedBox(height: 10.w),
              Text(
                "These notifications are sent 5 or 10 minutes before the *projected* auction end.\n\nAuction is not concrete time fixed and can be extended indefinitely, as long as new bids are coming, but only if they come in the last 5 minutes.\n\nFor example, we’ll send you a notification 5 minutes before the auction end, and if there won’t be any last-minute bids, voting will start in 5 minutes, but usually, there are. After notification delivery, usually, you will have to wait 15-20 minutes before FOMO voting starts.\n\nConsider it as a form of heads up to prepare yourself for FOMO. Or sit down, get yourself coffee and watch bid wars 😈",
                style: TextStyle(
                  fontSize: 18.sp,
                ),
              ),
              if (Platform.isIOS) SizedBox(height: 40.w),
              if (Platform.isIOS)
                Text(
                  "If you have denied notification permission request",
                  style: TextStyle(
                    fontFamily: AppFonts.londrina,
                    fontSize: 24.sp,
                    fontWeight: FontWeight.w700,
                    color: AppColors.purple,
                  ),
                ),
              if (Platform.isIOS) SizedBox(height: 10.w),
              if (Platform.isIOS)
                Text(
                  'If you have denied notification permission request, you will have to give permissions in the app settings.\n\nFor this:\n1) Open Settings.\n2) Find the Fomo Nouns app in the list of installed apps and open it.\n3) Open the "Notifications" section.\n4) Enable "Allow Notifications".\n\nYou now can select notifications you like!',
                  style: TextStyle(
                    fontSize: 18.sp,
                  ),
                ),
              SizedBox(height: 40.w),
              FlatTextButton(
                text: "Let's gooooooooo",
                onTap: () => Navigator.of(context).pop(),
              ),
              SizedBox(height: 50.w),
            ],
          ),
        ),
      ),
    );
  }
}
