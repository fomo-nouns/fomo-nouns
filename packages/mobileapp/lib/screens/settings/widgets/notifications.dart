import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';

class NotificationsSection extends StatelessWidget {
  const NotificationsSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SidePadding(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _title,
          const _Selectors(),
        ],
      ),
    );
  }

  Widget get _title => Padding(
        padding: EdgeInsets.only(bottom: 30.w),
        child: Text(
          "Notifications",
          style: TextStyle(
            fontFamily: AppFonts.londrina,
            fontSize: 36.sp,
            color: AppColors.textColor,
          ),
        ),
      );
}

class _Selectors extends StatelessWidget {
  const _Selectors({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _selector(
          type: "onAuctionEnd",
          text: "On auction end",
          value: false,
          onChange: (newValue) {},
        ),
      ],
    );
  }

  Widget _selector({
    required String type,
    required String text,
    required bool value,
    required Function(bool) onChange,
  }) =>
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            text,
            style: TextStyle(
              fontSize: 24.sp,
              color: AppColors.textColor,
              fontWeight: FontWeight.w500,
            ),
          ),
          CupertinoSwitch(
            value: value,
            onChanged: onChange,
          )
        ],
      );
}
