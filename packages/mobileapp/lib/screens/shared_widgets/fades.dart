import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';

Widget get fadeOverlayBottom {
  return Positioned.fill(
    child: Align(
      alignment: Alignment.bottomCenter,
      heightFactor: 1,
      child: IgnorePointer(
        child: Container(
          height: 20.h,
          decoration: const BoxDecoration(
            // Box decoration takes a gradient
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [AppColors.transparent, AppColors.fadeStartColor],
              stops: [0, 1],
            ),
          ),
        ),
      ),
    ),
  );
}
