import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';

class InDev extends StatelessWidget {
  const InDev({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SidePadding(
      child: Padding(
        padding: EdgeInsets.only(
          top: 20.w,
          left: 20.w,
          right: 20.w,
        ),
        child: Container(
          padding: EdgeInsets.symmetric(
            horizontal: 40.w,
            vertical: 5.w,
          ),
          decoration: BoxDecoration(
            color: const Color(0xffFF0000).withOpacity(0.10),
            borderRadius: BorderRadius.all(Radius.circular(15.w)),
          ),
          child: Text(
            "Voting functionality is currently under development",
            textAlign: TextAlign.center,
            style: TextStyle(
              color: const Color(0xffDD0000).withOpacity(0.70),
            ),
          ),
        ),
      ),
    );
  }
}
